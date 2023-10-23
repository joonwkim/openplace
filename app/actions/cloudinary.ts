'use server';

import { v2 as cloudinary } from 'cloudinary';
import { convertToObject } from 'typescript';
import { errorUtil } from 'zod/lib/helpers/errorUtil';
import { CloudiaryInfo } from '../lib/convert';

const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export async function getSignature(foldername: string) {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: foldername },
    cloudinaryConfig.api_secret as string
  );

  return { timestamp, signature };
}

const imgExists = async (filename: string) => {
  const resources = await getAssetResources();
  // console.log('resources: ', resources)
  return resources?.some(s => s.filename === filename);
};

export async function uploadFile(formData: FormData) {
  try {
    const folder: any = formData.get('folder');
    const file: any = formData.get('file');
    const name = file?.name.split('.')[0];
    const filename = `${folder}/${name}`;
    const exists = await imgExists(filename);
    // console.log(exists);
    if (!exists) {
      // console.log('uploading...');
      const endpoint = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL as string;
      const data = await fetch(endpoint, {
        method: 'POST',
        body: formData
      }).then(res => res.json());
      // console.log('upload result:', data);
      return data.public_id;
    } else {
      console.log('file already exists...');
    }
  } catch (error) {
    console.log(error);
  }
}

const getThumbnailImgUrlByFilename = async (filename: string) => {
  // console.log('search for thumbnail ')
  const resources = await getAssetResources();
  const res = resources?.find(s => s.filename === filename);
  // console.log('secure_url:',res?.secure_url)

  return res?.thumbnail_url;
};

export const getImgUrlByFilename = async (foldername: string, filename: string) => {
  const folderFilename = await convertToPublic_id(foldername, filename);
  const searchExp = `resource_type:image AND public_id:${folderFilename}*`;
  try {
    const result = await cloudinary.search.expression(searchExp).max_results(2).execute();
    if (result && result.total_count ===1) {
      return result.resources[0].secure_url
    }
  } catch (error) {
    console.log(error);
  }

};

export async function convertToPublic_id(foldername: string, fileName: string) {
  const name = fileName.split('.')[0];
  const pid = `${foldername}/${name}`;
  return pid;
}

export async function getThumbnailImgUrlFromCloudinary(foldername: string, filename: string) {
  const folderFilename = await convertToPublic_id(foldername, filename);
  // console.log('folderFilename', folderFilename);
  const exists = await imgExists(folderFilename);
  // console.log('exists', exists);
  if (exists) {
    return await getThumbnailImgUrlByFilename(folderFilename);
  }

}

export async function saveToDatabase({ public_id, version, signature }: { public_id: string, version: string, signature: string; }) {
  // verify the data
  const expectedSignature = cloudinary.utils.api_sign_request(
    { public_id, version },
    cloudinaryConfig.api_secret as string
  );

  if (expectedSignature === signature) {
    // safe to write to database
    console.log({ public_id });
  }
}

export async function getAssetResources() {
  try {
    const result = await cloudinary.api.resources();
    const { resources }: { resources: CloudiaryInfo[]; } = result;
    // console.log('getAssetResources:', resources)
    let mr: CloudiaryInfo[] = [];

    resources?.forEach(s => {
      const tn = s.secure_url.split('upload');
      const thtag = 'c_thumb,w_200,g_face';
      // console.log(tn[0])
      // console.log(tn[1])
      const thumbnail_url = `${tn[0]}upload/${thtag}${tn[1]}`;
      // console.log('thumbnail img:', thumbnail_url);
      const ci: CloudiaryInfo = {
        asset_id: s.asset_id,
        public_id: s.public_id,
        filename: s.public_id.split('_')[0],
        format: s.format,
        // resource_type:s.resource_type,
        bytes: s.bytes,
        // width:s.width,
        // height:s.height,
        folder: s.folder,
        // url:s.url,
        secure_url: s.secure_url,
        thumbnail_url: thumbnail_url,
      };
      // const ci:CloudiaryInfo = s;
      ci.filename = s.public_id.split('_')[0];
      // s.filename = s.public_id.split('_')[0];
      mr.push(ci);
    });
    // console.log('getAssetResources:', mr)
    return mr;
  } catch (error) {
    console.log(error);
  }
}

export async function getAssetDetail(publicId: string) {

  try {
    const result = cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    console.log(error);
  }

}

export async function deleteCloudinary() {

  //delete many
  cloudinary.api.delete_resources(['docs/strawberries', 'docs/owl']).then(result => console.log(result));
  // delete by tag keep original:true
  cloudinary.api.delete_resources_by_tag('test').then(result => console.log(result));

  //delete with prefix
  cloudinary.api.delete_resources_by_prefix('docs/').then(result => console.log(result));

  //to delete various transformation use invalidate: true
  cloudinary.uploader.destroy('publicId', { resource_type: 'video', invalidate: true, type: 'authenticated' }).then(result => console.log(result));

}

export async function getCloudinaryFolersUrl(publicId: string) {
  // return `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME}/folders`;
  const ci: CloudiaryInfo = await getAssetDetail(publicId) as CloudiaryInfo;
  return ci.folder;
}

