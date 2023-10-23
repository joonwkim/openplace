import { getSignature } from "@/app/actions/cloudinary";

export const getFormdata = async (file: any, foldername:string) => {
    const { timestamp, signature } = await getSignature(foldername);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string);
    formData.append('signature', signature);
    formData.append('timestamp', timestamp.toString());
    formData.append('folder', foldername);
    formData.append('upload-preset', 'open-place');
    return formData;
};
