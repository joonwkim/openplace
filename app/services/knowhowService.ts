'use server';
import prisma from '@/prisma/prisma';
import { Knowhow, Tag, User, KnowhowDetailInfo, ThumbnailType, } from '@prisma/client';
import { getTagsByName, } from './tagService';

export async function getKnowHowTypes() {
    try {
        const knowHowTypes = await prisma.knowhowType.findMany();
        // console.log(knowHowTypes)
        return knowHowTypes;
    } catch (error) {
        return ({ error });
    }
}
export async function createKnowHowWithDetailInfo(formData: FormData,knowhowDetailInfo:Omit<KnowhowDetailInfo, "id"|"knowHowId">) {
    try {
        // const formDataObj = Object.fromEntries(formData.entries());
        // console.log('create knowhow With detail action: ', JSON.stringify(formDataObj, null, 2));
        if (formData === null) {
            return;
        }
        const tag = formData.get('tags') as string;
        const tagNames = tag.toLocaleLowerCase().split(" ");
        const tagWhere: any = [];
        tagNames.map(n => {
            {
                const wh = { name: n };
                tagWhere.push(wh);
            }
        });
        const tags = await prisma.tag.findMany({
            where: {
                OR: tagWhere,
            },
        });
        let tagConnect: any = [];
        tags.map(t => { const con = { id: t.id }; tagConnect.push(con); });
        try {
            const file: any = formData.get('file');
            // console.log(file.name);
            const kn = await prisma.knowhow.create({
                data: {
                    title: formData.get('title') as string,
                    description: formData.get('description') as string,
                    thumbnailFilename: file.name,
                    knowHowTypeId: formData.get('knowHowTypeId') as string,
                    categoryId: formData.get('categoryId') as string,
                    authorId: formData.get('authorId') as string,
                    tags: {
                        connect: tagConnect,
                    }
                },
                include: {
                    tags: true,
                    knowhowDetailInfo: true,
                }
            });
            // console.log('created knowhow:', kn);
            // console.log('knowhow detail infomation youtube video id:', knowhowDetailInfo.videoIds);
            // console.log('knowhow detail infomation cloudinary youtube thumbnail type:', knowhowDetailInfo.thumbnailType);
            // console.log('knowhow detail infomation cloudinary img public Ids:', knowhowDetailInfo.cloudinaryImgPublicIds);
            // console.log('knowhow detail infomation cloudinary text file public Ids:', knowhowDetailInfo.cloudinaryTextFilePublicIds);
            // console.log('knowhow detail infomation cloudinary detail text:', knowhowDetailInfo.detailText);
            // console.log('create knowhow With detail information: ', JSON.stringify(knowhowDetailInfo.detailText, null, 2));

            // const videoIds = formData.get('videoIds');
            // const imgFiles = formData.get('imgFiles');
            // const pdfFiles = formData.get('pdfFiles');
            // const thumbnailType = formData.get('thumbnailType');
            // const text = formData.get('text');

            if(kn){
                const khd = await prisma.knowhowDetailInfo.create({
                    data: {
                        videoIds:  knowhowDetailInfo.videoIds,
                        thumbnailType: knowhowDetailInfo.thumbnailType as ThumbnailType,
                        imgFileNames: knowhowDetailInfo.imgFileNames,
                        pdfFileNames: knowhowDetailInfo.pdfFileNames,
                        detailText: knowhowDetailInfo.detailText,
                        knowhow: {
                            connect: {
                                id: kn.id
                            }
                        }
                    }
                });
                console.log('knowhow detail infomation created:', JSON.stringify(khd, null, 2));
            }

           
            return kn;
        } catch (error) {
            console.log('knowhow creation error(createKnowHowWithDetailInfo):', error);
        }
    } catch (error) {
        console.log('createKnowHow error:', error);
    }
}
export async function createKnowhow(formData: FormData) {
    try {
        console.log('createKnowHow:', formData);

        if (formData === null) {
            return;
        }
        const tag = formData.get('tags') as string;
        const tagNames = tag.toLocaleLowerCase().split(" ");
        const tagWhere: any = [];
        tagNames.map(n => {
            {
                const wh = { name: n };
                tagWhere.push(wh);
            }
        });
        const tags = await prisma.tag.findMany({
            where: {
                OR: tagWhere,
            },

        });

        let tagConnect: any = [];
        tags.map(t => { const con = { id: t.id }; tagConnect.push(con); });
        try {
            const kn = await prisma.knowhow.create({
                data: {
                    title: formData.get('title') as string,
                    description: formData.get('description') as string,
                    thumbnailFilename: formData.get('thumbNailImage') as string,
                    knowHowTypeId: formData.get('knowHowTypeId') as string,
                    categoryId: formData.get('categoryId') as string,
                    authorId: formData.get('authorId') as string,
                    tags: {
                        connect: tagConnect,
                    }
                },
                include: {
                    tags: true,
                }
            });
            console.log('created knowhow:', kn);

            return kn;
        } catch (error) {
            console.log('knowhow creation error(createKnowHow):', error);
        }
    } catch (error) {
        console.log('createKnowHow error:', error);
    }

}
export async function updateKnowhow(knowhow: Knowhow) {
    try {
        // console.log("knowhow before update: ", JSON.stringify(knowhow, null, 2))

        if (knowhow === null) {
            return;
        }
        try {
            const kn = await prisma.knowhow.update({
                where: {
                    id: knowhow.id
                },
                data: {
                    thumbsUpCount: knowhow.thumbsUpCount,
                    thumbsDownCount: knowhow.thumbsDownCount,
                    viewCount: knowhow.viewCount,
                },
                include: {
                    votes: true,
                    author: true,
                }
            });
            // console.log("knowhow after: ", JSON.stringify(kn, null, 2))
            return kn;
        } catch (error) {
            console.log('update knowhow error:', error);
        }
    } catch (error) {
        console.log('createKnowHow error:', error);
    }

}
export async function getKnowHows() {
    try {
        const knowHows = await prisma.knowhow.findMany({
            include: {
                // tags: true,
                // author: true,
                votes: true,
                knowhowDetailInfo: true,
                memberRequest:true,
                author:true,
            }
        });
        // console.log('get products: ', products)
        return knowHows;
    }
    catch (error) {
        console.log(error);
        // return error
    }

}
export async function getKnowHow(id: string) {
    try {
        const knowhow = await prisma.knowhow.findUnique({
            where: {
                id: id,
            },
            include: {
                tags: true,
                author: true,
                votes: true,
                KnowhowType: true,
                category: true,
                knowhowDetailInfo: true,
            }
        });
        // console.log('get products: ', products)
        return knowhow;
    }
    catch (error) {
        console.log(error);
        // return error
    }

}
export async function addKnowhowViewCount(id: string, count: number) {
    try {
        console.log(count);

        const kn = await prisma.knowhow.update({
            where: {
                id: id
            },
            data: {
                viewCount: count,
            },

        });
        // console.log("knowhow after: ", JSON.stringify(kn, null, 2))
        return kn;
    } catch (error) {
        console.log('update knowhow error:', error);
    }
}
