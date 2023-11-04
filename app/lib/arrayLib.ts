import { Knowhow } from "@prisma/client";

export const getImgUrls = (knowhow: any) => {
    const imgUrls = knowhow?.knowhowDetailInfo?.knowhowDetailOnCloudinaries?.map((s: any) => {
        if (s.cloudinaryData.format !== 'pdf') {
            return s.cloudinaryData.secure_url;
        };
    }).flatMap((f: any) => f ? [f] : []);
    return imgUrls;
};
export const getPdfUrls = (knowhow: any) => {
    const pdfUrls = knowhow?.knowhowDetailInfo?.knowhowDetailOnCloudinaries?.map((s: any) => {
        if (s.cloudinaryData.format === 'pdf') {
            return s.cloudinaryData.secure_url;
        };
    }).flatMap((f: any) => f ? [f] : []);
    return pdfUrls;
};
export const getThumbnailSecureUrl = (knowhow: any) => {
    if (!knowhow) return;
    const secure_url = knowhow.cloudinaryData?.secure_url;
    return secure_url;;
};
