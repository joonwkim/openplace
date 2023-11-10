'use server';
import { YoutubeInfo, getWatchUrl, getYoutubeInfoData } from "../lib/convert";

export const getYoutubeDataAction = async (id: string) => {
    const url = await getWatchUrl(id);
    const res = await getYoutubeInfoData(url) as YoutubeInfo;
    return res;
};