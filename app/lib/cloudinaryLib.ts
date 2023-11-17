import { CloudinaryData } from "@prisma/client";

export function getCloudinaryFile(cloudinaryData: CloudinaryData[]) {
    let fs: CloudinaryFile[] = [];
    cloudinaryData?.forEach((s: any) => {
        let f = new CloudinaryFile([], '');
        f.preview = s.cloudinaryData?.secure_url;
        f.filename = s.cloudinaryData?.filename;
        f.path = s.cloudinaryData?.path;
        f.cloudinaryDataId = s.cloudinaryData?.id;
        fs.push(f);
    });
    return fs;
};

export class CloudinaryFile extends File {
    filename: string | undefined | null;
    preview: string | undefined | null;
    cloudinaryDataId: string | undefined;
    path: string | undefined | null;

};
