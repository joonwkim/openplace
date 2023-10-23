import exp from "constants";
import path from "path";

export const getImgDirectory = () => {
    const dir = path.join(__dirname, "../../../../../public/images/");
    return dir;
};

export const getImageFilePath = (fileName: string) => {
    const fp = path.join(getImgDirectory(), fileName);
    console.log('public file path:', fp)
    return fp;

};
export async function getImgUrlFromPublic(filename: string) {
    const fp = path.join(getImgDirectory(), filename);
    console.log('public file path:', fp)
    return fp;

}