'use server';
import prisma from '@/prisma/prisma';
import { Knowhow, KnowhowDetailInfo, ThumbnailType } from "@prisma/client";
import { getYtDataIds } from './youtubeService';
import { getAndAddCloudinaryDataIds, } from './cloudinaryService';
import { consoleLogFormDatas } from '../lib/formdata';
import { StageProjectDetailData } from '../lib/types';

export async function addCdIdToKnowHowDetailInfo(knowhowId: string, cdId: string) {
    const khd = await prisma.knowhowDetailInfo.findFirst({
        where: {
            knowHowId: knowhowId,
        },
        include: {
            cloudinaryDatas: true,
        }
    });
    if (khd) {
        const cdIds = khd?.cloudinaryDataIds ? khd?.cloudinaryDataIds : [];
        cdIds.push(cdId);
        const unique = [...new Set(cdIds)];

        console.log('cdId:', cdId);
        console.log('cdIds:', cdIds);
        console.log('unique ids:', unique);

        const khdiUpdateted = await prisma.knowhowDetailInfo.update({
            where: {
                id: khd.id,
                knowHowId: knowhowId,
            },
            data: {
                cloudinaryDataIds: unique,
            },
            include: {
                cloudinaryDatas: true,
            }
        });
        // console.log('added cdids:', JSON.stringify(khdiUpdateted.cloudinaryDataIds, null, 2));
    }

}

export async function updateCdIdsOfKnowHowDetailInfo(knowhowId: string, cdIds: string[]) {
    const khd = await prisma.knowhowDetailInfo.findFirst({
        where: {
            knowHowId: knowhowId,
        },
        include: {
            cloudinaryDatas: true,
        }
    });
    if (khd) {

        const khdiUpdateted = await prisma.knowhowDetailInfo.update({
            where: {
                id: khd.id,
                knowHowId: knowhowId,
            },
            data: {
                cloudinaryDataIds: cdIds,
            },
            include: {
                cloudinaryDatas: true,
            }
        });
    }

}

export async function updateKnowHowDetailInfo(knowhowId: string, knowhowDetailInfo: Omit<KnowhowDetailInfo, "id" | "knowHowId">, ytDataIds: string[]) {


    const khd = await prisma.knowhowDetailInfo.findFirst({
        where: {
            knowHowId: knowhowId,
        },
        include: {
            cloudinaryDatas: true,
        }
    });
    if (khd) {

        const khdiUpdateted = await prisma.knowhowDetailInfo.update({
            where: {
                id: khd.id,
                knowHowId: knowhowId,
            },
            data: {
                detailText: knowhowDetailInfo.detailText,
                youtubeDataIds: ytDataIds,
            },
            include: {
                cloudinaryDatas: true,
            }
        });

    }
}

export async function updateKnowhowDetailInfo(knowhow: Knowhow, knowhowDetailInfo: Omit<KnowhowDetailInfo, "id" | "knowHowId">, ytData: any[], cdIds: string[], imgFormData: any[], pdfFormData: any[]) {

    try {
        let ytDataIds: string[] = [];
        if (ytData?.length > 0) {
            ytDataIds = await getYtDataIds(ytData);
        }
        let khd: any = await prisma.knowhowDetailInfo.findFirst({
            where: {
                knowHowId: knowhow.id,
            },
            include: {
                cloudinaryDatas: true,
            }
        });
        if (!khd) {
            khd = await prisma.knowhowDetailInfo.create({
                data: {
                    thumbnailType: knowhowDetailInfo.thumbnailType as ThumbnailType,
                    knowhow: {
                        connect: {
                            id: knowhow.id,
                        }
                    },
                }
            });
        }
        if (khd) {
            const khdiUpdateted = await prisma.knowhowDetailInfo.update({
                where: {
                    id: khd.id,
                    knowHowId: knowhow.id,
                },
                data: {
                    detailText: knowhowDetailInfo.detailText,
                    youtubeDataIds: ytDataIds,
                    cloudinaryDataIds: cdIds,
                },
                include: {
                    cloudinaryDatas: true,
                }
            });
            await getAndAddCloudinaryDataIds(imgFormData, knowhow.id);
            await getAndAddCloudinaryDataIds(pdfFormData, knowhow.id);
        }
    } catch (error) {
        console.log('updateKnowhowDetailInfo error: ', error);
        throw error;
    }
}

export async function createChildKnowhowDetailInfo(knowhow: Knowhow, stageProjectDetail?: StageProjectDetailData) {
    try {
        const knowhowDetail = await prisma.knowhowDetailInfo.create({
            data: {
                thumbnailType: ThumbnailType.MEDIUM,
                detailText: stageProjectDetail?.text,
                knowhow: {
                    connect: {
                        id: knowhow.id,
                    }
                },
            }
        });
        return knowhowDetail;

    } catch (error) {

    }
}
export async function createKnowhowDetailInfo(knowhow: Knowhow, knowhowDetailInfo: Omit<KnowhowDetailInfo, "id" | "knowHowId">, ytDataIds: string[]) {
    try {
        const knowhowDetail = await prisma.knowhowDetailInfo.create({
            data: {
                thumbnailType: knowhowDetailInfo.thumbnailType as ThumbnailType,
                detailText: knowhowDetailInfo.detailText,
                knowhow: {
                    connect: {
                        id: knowhow.id,
                    }
                },
            }
        });
        if (knowhowDetail && ytDataIds.length > 0) {
            const update = await prisma.knowhowDetailInfo.update({
                where: {
                    id: knowhowDetail.id,
                },
                data: {
                    youtubeDataIds: ytDataIds,
                }
            });
            return update;
        }
        return knowhowDetail;
    }
    catch (error) {
        console.log('createKnowhowDetailInfo error: ', error);
        throw error;
    }
}

export async function createAndUpdateKnowhowDetailInfo(knowhow: Knowhow, knowhowDetailInfo: Omit<KnowhowDetailInfo, "id" | "knowHowId">, ytData: any[], imgFormData: any[], pdfFormData: any[]) {

    let ytDataIds: string[] = [];
    if (ytData !== undefined && ytData.length > 0) {
        ytDataIds = await getYtDataIds(ytData);
    }
    // console.log('knowhowDetailInfo:', knowhowDetailInfo, ytDataIds)
    if (knowhowDetailInfo.detailText) {
        const khdi = await createKnowhowDetailInfo(knowhow, knowhowDetailInfo, ytDataIds);
        console.log('knowhow detail info created: ', khdi);
        if (khdi) {
            await getAndAddCloudinaryDataIds(imgFormData, knowhow.id);
            await getAndAddCloudinaryDataIds(pdfFormData, knowhow.id);
            return khdi;
        }
    }
}

