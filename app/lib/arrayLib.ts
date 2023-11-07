import { getYoutubeDataAction } from "../actions/youtubeAction";
import { YoutubeInfo } from "./convert";


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

export const getYtInfos = (videoIds: any[] | undefined) => {
    let ytInfos: YoutubeInfo[] = [];
    if (videoIds && videoIds.length > 0) {
        videoIds.forEach(async id => {
            const yd = await getYoutubeDataAction(id) as YoutubeInfo;
            if (yd) {
                ytInfos.push(yd);
            }
        });
    }
    return ytInfos;
};

