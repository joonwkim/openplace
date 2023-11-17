'use server';
import prisma from '@/prisma/prisma';
import { Knowhow, KnowhowDetailInfo, ThumbnailType } from "@prisma/client";
import { getYtDataIds } from './youtubeService';
import { getAndAddCloudinaryDataIds, getAndUpdateCloudinaryDataIds } from './cloudinaryService';
import { consoleLogFormDatas } from '../lib/formdata';

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
        console.log('added cdids:', JSON.stringify(khdiUpdateted.cloudinaryDataIds, null, 2));
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
        console.log('cdIds: ', cdIds);
        // console.log('knowhowDetailInfo:', knowhowDetailInfo);
        // console.log('ytData:', ytData);
        consoleLogFormDatas('imgFormData:', imgFormData);
        consoleLogFormDatas('pdfFormData:', pdfFormData);

        let ytDataIds: string[] = [];
        if (ytData.length > 0) {
            ytDataIds = await getYtDataIds(ytData);
        }



        const khd = await prisma.knowhowDetailInfo.findFirst({
            where: {
                knowHowId: knowhow.id,
            },
            include: {
                cloudinaryDatas: true,
            }
        });

        if (khd) {

            console.log('knowhowdetailinfo found: ', khd);
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

            // let imgcloudinaryDataIds: string[] = [];
            // if (imgFormData.length > 0) {
            //     imgcloudinaryDataIds = await getAndUpdateCloudinaryDataIds(imgFormData, knowhow.id);
            //     console.log('imgcloudinaryDataIds:', imgcloudinaryDataIds);
            // }

            await getAndAddCloudinaryDataIds(pdfFormData, knowhow.id);

            // let pdfcloudinaryDataIds: string[] = [];
            // if (pdfFormData.length > 0) {
            //     pdfcloudinaryDataIds = await getAndUpdateCloudinaryDataIds(pdfFormData, knowhow.id);

            //     console.log('pdfcloudinaryDataIds:', imgcloudinaryDataIds);
            // }

            // console.log('khdiUpdateted:', JSON.stringify(khdiUpdateted, null, 2));
            // if (khdiUpdateted) {
            //     await getAndUpdateCloudinaryDataIds(imgFormData, knowhow.id);
            //     await getAndUpdateCloudinaryDataIds(pdfFormData, knowhow.id);
            // }
        }
        else {
            console.log('knowhow detail info not found:');
        }

    } catch (error) {
        console.log('updateKnowhowDetailInfo error: ', error);
        throw error;
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
        if (knowhowDetail) {
            const update = await prisma.knowhowDetailInfo.update({
                where: {
                    id: knowhowDetail.id,
                },
                data: {
                    youtubeDataIds: ytDataIds,
                }
            });
            // console.log('knowhowDetailInfo created: ', knowhowDetail);
            return update;
        }
        return knowhowDetail;
    }
    catch (error) {

    }
}

export async function createAndUpdateKnowhowDetailInfo(knowhow: Knowhow, knowhowDetailInfo: Omit<KnowhowDetailInfo, "id" | "knowHowId">, ytData: any[], imgFormData: any[], pdfFormData: any[]) {
    let ytDataIds: string[] = [];
    if (ytData.length > 0) {
        ytDataIds = await getYtDataIds(ytData);
        // console.log('ytDataIds:', ytDataIds);
    }

    const khdi = await createKnowhowDetailInfo(knowhow, knowhowDetailInfo, ytDataIds);

    if (khdi) {
        await getAndUpdateCloudinaryDataIds(imgFormData, knowhow.id);
        await getAndUpdateCloudinaryDataIds(pdfFormData, knowhow.id);
    }

}

