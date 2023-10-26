'use server';

import { getImgUrlByFilename } from "./cloudinary";

export const getImgUrlByFilenameAction = async (foldername: string, filename: string) => {
    const res = await getImgUrlByFilename(foldername, filename);
    return res;
};