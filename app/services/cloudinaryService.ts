import { KnowhowDetailOnCloudinary } from "@prisma/client";
import { CloudiaryInfo } from "../lib/convert";
import { getAssetResources, uploadImage } from "../actions/cloudinary";
import prisma from '@/prisma/prisma';
import { consoleLogFormData } from "../lib/formdata";

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

export const getImgSecureUrls = async (cloudinaryData: KnowhowDetailOnCloudinary[]) => {

    console.log(cloudinaryData);

    cloudinaryData?.forEach(async (kdc: KnowhowDetailOnCloudinary) => {
        console.log(kdc);
    });
    return null;
};

export const uploadImagesToCloudinaryAndCreateCloudinaryData = async (formData: any) => {
    try {
        consoleLogFormData('upload ImagesToCloudinaryAndCreateCloudinaryData', formData);
        const file = formData.get('file');
        if (file !== "undefined") {
            const filename = file.name.split('.');
            const res = await getCloudinaryData('openplace', filename[0], filename[1]);
            if (!res) {
                const ci = await uploadImage(formData);
                if (ci) {
                    const uploaded = await createCloudinaryData(ci);
                    return uploaded;
                }
            }
            else {
                return res;
            }
        }

    } catch (error) {
        console.log('uploadImagesToCloudinaryAndCreateCloudinaryData error:', error);
        throw error;
    }
};

export const getThumbnailSecureUrl = (knowhow: any) => {
    if (!knowhow) return;
    const secure_url = knowhow.cloudinaryData?.secure_url;
    return secure_url;;
};

export const getImgSecureUrl = async (id: string) => {
    const cd = await prisma.cloudinaryData.findFirst({
        where: {
            id: id,
        }
    });
    if (cd) {
        console.log('getImgSecureUrl', cd.secure_url);
        return cd.secure_url;
    }
};

