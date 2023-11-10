'use server';
import prisma from '@/prisma/prisma';
import { Knowhow, Tag, User, KnowhowDetailInfo, ThumbnailType, CloudinaryData, KnowhowDetailOnCloudinary, } from '@prisma/client';
import { createTags, getTagsByName, } from './tagService';
import { uploadImagesToCloudinaryAndCreateCloudinaryData } from './cloudinaryService';
// import { createCloudinaryData, getCloudinaryData, uploadImagesToCloudinaryAndCreateCloudinaryData } from './cloudinaryService';
// import { uploadImage } from '../actions/cloudinary';
// import { consoleLogFormData } from '../lib/formdata';
import { CloudinaryFile } from '../regContents/components/regiImages';
import { consoleLogFormDatas } from '../lib/formdata';

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

        if (formData === null) {
            return;
        }
        const tagList = formData.get('tags') as string;
        let tagConnect = await createTags(tagList) as any[];

        try {
            const file: any = formData.get('file');

            const kn = await prisma.knowhow.create({
                data: {
                    title: formData.get('title') as string,
                    description: formData.get('description') as string,
                    // thumbnailFilename: file.name,
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
                        // videoIds: knowhowDetailInfo.videoIds,
                        thumbnailType: knowhowDetailInfo.thumbnailType as ThumbnailType,
                        // imgFileNames: knowhowDetailInfo.imgFileNames,
                        // pdfFileNames: knowhowDetailInfo.pdfFileNames,
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

export async function updateKnowHowWithDetailInfo(knowhowSelected: Knowhow, genFormData: any, knowhowDetailInfo: Omit<KnowhowDetailInfo, "id" | "knowHowId">, ytData: any[], imgFormData: any[], cloudinaryDataIdsToDelete: string[], pdfFormData: any[]) {
    try {

        // console.log('ytData in updateKnowHowWithDetailInfo: ', ytData);


        const { otherFormData, thumbNailFormData } = genFormData;

        let ytDataIds: string[] = [];
        ytData.forEach(async yt => {
            try {
                // console.log('ytdata id:', yt.id);
                if (yt.id === null || yt.id === undefined) {
                    const ytd = await prisma.youTubeData.create({ data: yt });
                    if (ytd) {

                        ytDataIds.push(ytd.id);
                        console.log('created ytdata and pushed:', ytDataIds);
                    }
                }
                else {
                    ytDataIds.push(yt.id);
                }
            } catch (error) {
                console.log('yt  ids :', error);
            }
        });
        console.log('ytdata ids updated:', ytDataIds);
        // const formDataObj = Object.fromEntries(otherFormData.entries());

        // !  create or connect tags
        if (otherFormData === null) {
            return;
        }
        const tagList = otherFormData.get('tags') as string;
        let tagConnect = await createTags(tagList) as any[];

        // ! create or get regi general thumbnail cloudinary data

        try {
            const result = await uploadImagesToCloudinaryAndCreateCloudinaryData(thumbNailFormData) as CloudinaryData;
            const file: any = otherFormData.get('file');
            const knowhowUpdated = await prisma.knowhow.update({
                where: {
                    id: knowhowSelected.id,
                },
                data: {
                    title: otherFormData.get('title') as string,
                    description: otherFormData.get('description') as string,
                    knowHowTypeId: otherFormData.get('knowHowTypeId') as string,
                    categoryId: otherFormData.get('categoryId') as string,
                    authorId: otherFormData.get('authorId') as string,
                    cloudinaryDataId: result?.id,
                    tags: {
                        connect: tagConnect,
                    },
                },
                // include: {
                //     tags: true,
                //     knowhowDetailInfo: true,
                //     cloudinaryData: true,
                // }
            });
            console.log('knowhow updated:', knowhowUpdated);
            try {

                //! update knowhowdetail info
                const khd = await prisma.knowhowDetailInfo.findFirst({
                    where: {
                        knowHowId: knowhowUpdated.id
                    }
                });



                if (khd) {
                    const khdiUpdateted = await prisma.knowhowDetailInfo.update({
                        where: {
                            id: khd.id,
                            knowHowId: knowhowUpdated.id,
                        },
                        data: {
                            youtubeDataIds: ytDataIds,
                            detailText: knowhowDetailInfo.detailText,
                        },
                        include: {
                            knowhowDetailOnCloudinaries: true,
                        }
                    });

                    imgFormData.forEach(async s => {
                        const file = s.get('file') as CloudinaryFile;
                        const imgUpload = await uploadImagesToCloudinaryAndCreateCloudinaryData(s) as CloudinaryData;
                        console.log('img upload result', imgUpload);
                        if (imgUpload) {
                            const kdoc = await prisma.knowhowDetailOnCloudinary.create({
                                data: {
                                    knowhowDetailInfoId: khdiUpdateted.id,
                                    cloudinaryDataId: imgUpload.id
                                }
                            });
                            // console.log('knowhowDetailOnCloudinary', kdoc);
                        }
                    });

                    const knowhowDetailOnCloudinaries = khdiUpdateted.knowhowDetailOnCloudinaries;
                    let cls = knowhowDetailOnCloudinaries.map(s => s.cloudinaryDataId);

                    let ids: string[] = [];

                    cloudinaryDataIdsToDelete.forEach(s => {
                        const i = cls.indexOf(s);
                        const cd = knowhowDetailOnCloudinaries[i];
                        ids.push(cd.id);
                    });

                    ids.forEach(async s => {
                        const dc = await prisma.knowhowDetailOnCloudinary.delete({
                            where: {
                                id: s,
                            }
                        });
                        console.log('deleted:', dc);
                    });

                    console.log('knowhow detail info updated: ', khdiUpdateted);

                    //! pdf 
                    // pdfFormData.forEach(async pdfFormData => {

                    //     const pdfUpload = await uploadImagesToCloudinaryAndCreateCloudinaryData(pdfFormData) as CloudinaryData;
                    //     console.log('pdf upload result', pdfUpload);

                    //     // ! create  KnowhowDetailOnCloudinary
                    //     const kdoc = await prisma.knowhowDetailOnCloudinary.create({
                    //         data: {
                    //             knowhowDetailInfoId: knowhowDetailInfo.id,
                    //             cloudinaryDataId: pdfUpload.id
                    //         }
                    //     });
                    //     console.log('knowhowDetailOnCloudinary', kdoc);
                    // });
                }


            } catch (error) {
                console.log('knowhow detail info update error:', error);
            }

        } catch (error) {
            console.log('knowhow update error: ', error);
        }
    } catch (error) {
        console.log('knowhow update error:', error);
    }
}

export async function createKnowHowWithDetailInfo(genFormData: any, knowhowDetailInfo: Omit<KnowhowDetailInfo, "id" | "knowHowId">, ytData: any[], imgFormData: any[], pdfFormData: any[]) {
    try {



        //! implement $transaction later

        const { otherFormData, thumbNailFormData } = genFormData;
        // !  create or connect tags
        if (otherFormData === null) {
            return;
        }
        const tagList = otherFormData.get('tags') as string;
        let tagConnect = await createTags(tagList) as any[];

        // ! create or get regi general thumbnail cloudinary data
        const result = await uploadImagesToCloudinaryAndCreateCloudinaryData(thumbNailFormData) as CloudinaryData;
        if (!result) return;

        try {
            const file: any = otherFormData.get('file');
            const knowhow = await prisma.knowhow.create({
                data: {
                    title: otherFormData.get('title') as string,
                    description: otherFormData.get('description') as string,
                    // thumbnailFilename: file.name,
                    knowHowTypeId: otherFormData.get('knowHowTypeId') as string,
                    categoryId: otherFormData.get('categoryId') as string,
                    authorId: otherFormData.get('authorId') as string,
                    cloudinaryDataId: result?.id,
                    tags: {
                        connect: tagConnect,
                    },
                },
                include: {
                    tags: true,
                    knowhowDetailInfo: true,
                    cloudinaryData: true,
                }
            });
            console.log('knowhow created:', knowhow);
            let ytDataIds: string[] = [];
            ytData.forEach(async yt => {
                const ytd = await prisma.youTubeData.create({ data: yt });
                if (ytd) {
                    ytDataIds.push(ytd.id);
                }
            });
            if (knowhow) {
                // ! create knowhow detail info
                const knowhowDetail = await prisma.knowhowDetailInfo.create({
                    data: {
                        // videoIds: knowhowDetailInfo.videoIds,
                        // youtubeDataIds: ytDataIds,
                        thumbnailType: knowhowDetailInfo.thumbnailType as ThumbnailType,
                        // imgFileNames: knowhowDetailInfo.imgFileNames,
                        // pdfFileNames: knowhowDetailInfo.pdfFileNames,
                        detailText: knowhowDetailInfo.detailText,
                        knowhow: {
                            connect: {
                                id: knowhow.id
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
                    console.log('knowhowDetailInfo created: ', knowhowDetail);
                }


                try {
                    //!img and pdf files upload for knowhow Detail info
                    console.log('image form data starting');
                    //! img
                    imgFormData.forEach(async imgFormData => {
                        const imgUpload = await uploadImagesToCloudinaryAndCreateCloudinaryData(imgFormData) as CloudinaryData;
                        console.log('img upload result', imgUpload);

                        // ! create  KnowhowDetailOnCloudinary
                        const kdoc = await prisma.knowhowDetailOnCloudinary.create({
                            data: {
                                knowhowDetailInfoId: knowhowDetail.id,
                                cloudinaryDataId: imgUpload.id
                            }
                        });
                        console.log('knowhowDetailOnCloudinary', kdoc);

                    });
                    console.log('pdf form data starting');

                    //! pdf 
                    pdfFormData.forEach(async pdfFormData => {

                        const pdfUpload = await uploadImagesToCloudinaryAndCreateCloudinaryData(pdfFormData) as CloudinaryData;
                        console.log('pdf upload result', pdfUpload);

                        // ! create  KnowhowDetailOnCloudinary
                        const kdoc = await prisma.knowhowDetailOnCloudinary.create({
                            data: {
                                knowhowDetailInfoId: knowhowDetail.id,
                                cloudinaryDataId: pdfUpload.id
                            }
                        });
                        console.log('knowhowDetailOnCloudinary', kdoc);
                    });
                } catch (error) {
                    console.log(error);
                }
            }
            return knowhow;
        } catch (error) {
            console.log('knowhow creation error: ', error);
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
        const tagList = formData.get('tags') as string;
        let tagConnect = await createTags(tagList) as any[];

        try {
            const kn = await prisma.knowhow.create({
                data: {
                    title: formData.get('title') as string,
                    description: formData.get('description') as string,
                    // thumbnailFilename: formData.get('thumbNailImage') as string,
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

export async function getKnowhows() {
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
                cloudinaryData: true,
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

export async function getKnowhow(id: string) {
    if (!id) return;
    try {
        const knowhow = await prisma.knowhow.findFirst({
            where: {
                id: id,
            },
            include: {
                tags: true,
                author: true,
                votes: true,
                KnowhowType: true,
                category: true,
                cloudinaryData: true,
                knowhowDetailInfo: {
                    include: {
                        knowhowDetailOnCloudinaries: {
                            include: {
                                cloudinaryData: true,
                                knowhowDetailInfo: true,
                            }
                        },
                        youtubeDatas: true

                    },
                },
                children: true,

            }
        });
        return knowhow;
    }
    catch (error) {
        console.log('getKnowhow', error);
        throw error;
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
