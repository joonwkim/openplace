import { KnowhowDetailOnCloudinary } from "@prisma/client";
import { CloudiaryInfo } from "../lib/convert";
import { getAssetResources } from "../actions/cloudinary";

export const getCloudinaryData = async (foldername: string, filename: string, format: string) => {
    const res = await prisma?.cloudinaryData.findFirst({
        where: {
            folder: foldername,
            filename: `${foldername}/${filename}`,
            format: format,
        }
    });
    return res;
};

export const createCloudinaryData = async (ci: CloudiaryInfo) => {
    try {
        const ciData = await prisma?.cloudinaryData.create({
            data: {
                asset_id: ci.asset_id,
                public_id: ci.public_id,
                filename: ci.filename,
                format: ci.format,
                bytes: ci.bytes,
                folder: ci.folder,
                secure_url: ci.secure_url,
                thumbnail_url: ci.thumbnail_url,
            }
        });
        console.log('cloudinaryData created: ', ciData);
        return ciData;
    } catch (error) {
        return ({ error });
    }
};

export const getCloudinaryAndSave = async () => {
    const cis = await getAssetResources();
    // console.log('getAssetResources', cis);
    if (cis) {
        const cisArray = cis as CloudiaryInfo[];
        cisArray.forEach(async ci => {
            const res = await createCloudinaryData(ci);
            console.log('ci data', res);
        });
    }
};

export const getImgSecureUrls = async (cloudinaryData:KnowhowDetailOnCloudinary[]) =>{

    console.log(cloudinaryData)
    
    cloudinaryData?.forEach(async (kdc:KnowhowDetailOnCloudinary) => {
      console.log(kdc)
    });
   
    // const result = await prisma?.knowhowDetailOnCloudinary.findMany({
    //     where:{
    //         OR: []
    //     },
    // })

    return null;
}