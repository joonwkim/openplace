'use server';
import prisma from '@/prisma/prisma';

export async function getYtData() {
    return await prisma.youTubeData.findMany({});
}
export async function getYtDataIds(ytData: any[]) {
    let ytDataIds: string[] = [];
    ytData?.forEach(async yt => {
        try {
            const ytData = await prisma.youTubeData.findFirst({
                where: {
                    watchUrl: yt.watchUrl
                }
            });
            if (ytData) {
                ytDataIds.push(ytData.id);
            } else {
                const ytData = await prisma.youTubeData.create({ data: yt });
                if (ytData) {
                    ytDataIds.push(ytData.id);

                }
            }
            // console.log('ytdata ids:', ytDataIds);
        } catch (error) {
            console.log('upsertYtData error:', error);
            throw error;
        }
    });
    return ytDataIds;
}