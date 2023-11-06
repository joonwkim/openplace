import { Knowhow } from "@prisma/client";
import { getImgSecureUrl, getImgSecureUrls } from "../services/cloudinaryService";

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

