'use server'
import { publicDecrypt } from 'crypto';
// import { promises as fsPromises } from 'fs';
// import { join } from 'path';
import path from "path";
import fs from "fs";
// import { readFileSync, writeFileSync } from 'fs';
// import RegisterPage from '../auth/register/page';


const getImageFileDirectory = (imgDir: string) => {
    return path.resolve("../place", "public", imgDir);
}

export const writeFile = async (data: FormData) => {
    try {
        // console.log('formData:', data)

        // const filename = data.get('filename') as string;
        
        // const filePath = join(getImageFileDirectory('images'), filename);
        // console.log('filePath:', filePath)
        // // await fsPromises.writeFile(filePath, data, {
        // //     flag: 'w',
        // // });

        // const file: File | null = data.get('file') as unknown as File

        // const bytes = await file.arrayBuffer()
        // const buffer = Buffer.from(bytes)

        // writeFileSync(filePath, buffer, { flag: 'w', });

        // const contents = await fsPromises.readFile(filePath, 'utf-8',);
        // console.log('contents: ', contents);

        // return contents;
    } catch (err) {
        console.log('writeFile', err);
        // return 'Something went wrong';
    }
}

export const getFiles = async () => {
    const imgDir = "images";
    const dir = getImageFileDirectory(imgDir)

    const filenames = fs.readdirSync(dir);

    const images = filenames.map((name) => path.join("/", imgDir, name));
    // console.log('dir: ', dir)
    // console.log('filenames: ', filenames)
    // console.log('images: ', images)
};