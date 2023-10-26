'use server';
import prisma from '@/prisma/prisma';
import { Knowhow, Tag, User, KnowhowDetailInfo, ThumbnailType, } from '@prisma/client';
import { getTagsByName, } from './tagService';

export async function getKnowHowTypes() {
    try {
        const knowHowTypes = await prisma.knowhowType.findMany();
        return knowHowTypes;
    } catch (error) {
        return ({ error });
    }
}

export async function createChildKnowHowWithDetailInfo(parentKnowhowId: string, formData: FormData, knowhowDetailInfo: Omit<KnowhowDetailInfo, "id" | "knowHowId">) {
    try {
        // const formDataObj = Object.fromEntries(formData.entries());
        // console.log('create knowhow With detail action: ', JSON.stringify(formDataObj, null, 2));
        // console.log('parentKnow in createChildKnowHowWithDetailInfo', parentKnowhowId);

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
            const kn = await prisma.knowhow.create({
                data: {
                    title: formData.get('title') as string,
                    description: formData.get('description') as string,
                    thumbnailFilename: file.name,
                    knowHowTypeId: formData.get('knowHowTypeId') as string,
                    categoryId: formData.get('categoryId') as string,
                    authorId: formData.get('authorId') as string,
                    parentId: parentKnowhowId,
                    tags: {
                        connect: tagConnect,
                    },
                },
                include: {
                    tags: true,
                    knowhowDetailInfo: true,
                }
            });

            if (kn) {
                const khd = await prisma.knowhowDetailInfo.create({
                    data: {
                        videoIds: knowhowDetailInfo.videoIds,
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
                // console.log('knowhow detail infomation created:', JSON.stringify(khd, null, 2));
            }

            console.log('child knowhow created:', JSON.stringify(kn, null, 2));

            return kn;
        } catch (error) {
            console.log('knowhow creation error(createKnowHowWithDetailInfo):', error);
        }
    } catch (error) {
        console.log('createKnowHow error:', error);
    }
}

export async function createKnowHowWithDetailInfo(formData: FormData, knowhowDetailInfo: Omit<KnowhowDetailInfo, "id" | "knowHowId">) {
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

            if (kn) {
                const khd = await prisma.knowhowDetailInfo.create({
                    data: {
                        videoIds: knowhowDetailInfo.videoIds,
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
                // console.log('knowhow detail infomation created:', JSON.stringify(khd, null, 2));
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
        // console.log('getKnowHows');
        const knowHows = await prisma.knowhow.findMany({
            where: {
                parent: null,
            },
            include: {
                // tags: true,
                // author: true,
                votes: true,
                knowhowDetailInfo: true,
                membershipRequest: true,
                author: true,
                children: true,
            }
        });
        // console.log('getKnowHows', JSON.stringify(knowHows, null, 2));
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
                children: true,
            }
        });
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
        return kn;
    } catch (error) {
        console.log('update knowhow error:', error);
    }
}
