'use server';
import { YoutubeInfo, getWatchUrl, getYoutubeData } from "../lib/convert";

export const getYoutubeDataAction = async (id: string) => {
    const url = await getWatchUrl(id);
    const res = await getYoutubeData(url) as YoutubeInfo;
    return res;
};