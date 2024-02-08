'use server';
import prisma from '@/prisma/prisma';
import { Knowhow, Tag, User, KnowhowDetailInfo, ThumbnailType, CloudinaryData } from '@prisma/client';
import { createTags, getTagsByName, } from './tagService';
import { getThumbnailCloudinaryDataId, uploadImagesToCloudinaryAndCreateCloudinaryData } from './cloudinaryService';
// import { createCloudinaryData, getCloudinaryData, uploadImagesToCloudinaryAndCreateCloudinaryData } from './cloudinaryService';
// import { uploadToCloudinary } from '../actions/cloudinary';
// import { consoleLogFormData } from '../lib/formdata';
import { consoleLogFormData, consoleLogFormDatas } from '../lib/formdata';
import { CloudinaryFile } from '../lib/cloudinaryLib';
import { serialize } from 'v8';
import { StageContents, Stage, } from '../lib/types';
import { connect } from 'http2';
import { number } from 'zod';

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

            // console.log('child knowhow created:', JSON.stringify(kn, null, 2));

            return kn;
        } catch (error) {
            console.log('knowhow creation error(createKnowHowWithDetailInfo):', error);
        }
    } catch (error) {
        console.log('createKnowHow error:', error);
    }
}

export async function updateGeneralKnowhow(knowhowSelected: Knowhow, genFormData: any) {
    // console.log('updateGeneralKnowhow', knowhowSelected)
    if (!genFormData) {
        return;
    }
    const { otherFormData, thumbNailFormData } = genFormData;
    if (!otherFormData) {
        return;
    }
    // consoleLogFormData('otherFormData', otherFormData)
    let tagConnect: any[] = [];
    if (otherFormData !== null) {
        const tagList = otherFormData.get('tags') as string;
        tagConnect = await createTags(tagList) as any[];
    }

    let isGroupType: boolean = false;
    if (otherFormData?.get('isGroupType') === 'true') {
        isGroupType = true;
    }
    let updatedKnowhow: Knowhow = await prisma.knowhow.update({
        where: {
            id: knowhowSelected.id,
        },
        data: {
            title: otherFormData?.get('title') as string,
            description: otherFormData.get('description') as string,
            knowHowTypeId: otherFormData.get('knowHowTypeId') as string,
            categoryId: otherFormData.get('categoryId') as string,
            authorId: otherFormData.get('authorId') as string,
            isProjectType: knowhowSelected.isProjectType,
            isGroupType: isGroupType,
            tags: {
                connect: tagConnect,
            },
        },
        include: {
            tags: true,
            knowhowDetailInfo: true,
            thumbnailCloudinaryData: true,
        }
    });

    if (thumbNailFormData !== null) {
        const result = await uploadImagesToCloudinaryAndCreateCloudinaryData(thumbNailFormData) as CloudinaryData;
        updatedKnowhow = await prisma.knowhow.update({
            where: {
                id: knowhowSelected.id,
            },
            data: {
                cloudinaryDataId: result?.id,
            },
            include: {
                tags: true,
                knowhowDetailInfo: true,
                thumbnailCloudinaryData: true,
            }
        });
    }
    // console.log('updatedKnowhow:', updatedKnowhow);
    // return updatedKnowhow;
}

export async function updateKnowHowWithDetailInfo(knowhowSelected: Knowhow, genFormData: any, knowhowDetailInfo: Omit<KnowhowDetailInfo, "id" | "knowHowId">, ytData: any[], imgFormData: any[], cloudinaryDataIdsToDelete: string[], pdfFormData: any[]) {
    try {

        // console.log('ytData in updateKnowHowWithDetailInfo: ', ytData);
        // consoleLogFormDatas('pdf file formdata', pdfFormData);

        const { otherFormData, thumbNailFormData } = genFormData;

        let ytDataIds: string[] = [];
        ytData?.forEach(async yt => {
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
        // console.log('ytdata ids updated:', ytDataIds);

        // !  create or connect tags
        if (otherFormData === null) {
            return;
        }
        const tagList = otherFormData.get('tags') as string;
        let tagConnect = await createTags(tagList) as any[];

        // ! create or get regi general thumbnail cloudinary data

        try {
            const knowhowUpdated = await prisma.knowhow.update({
                where: {
                    id: knowhowSelected.id,
                },
                data: {
                    title: otherFormData?.get('title') as string,
                    description: otherFormData.get('description') as string,
                    knowHowTypeId: otherFormData.get('knowHowTypeId') as string,
                    categoryId: otherFormData.get('categoryId') as string,
                    authorId: otherFormData.get('authorId') as string,
                    // cloudinaryDataId: result?.id,
                    tags: {
                        connect: tagConnect,
                    },
                },
                include: {
                    tags: true,
                    knowhowDetailInfo: true,
                    thumbnailCloudinaryData: true,
                }
            });
            // console.log('knowhow updated:', knowhowUpdated);

            if (thumbNailFormData !== null) {
                const result = await uploadImagesToCloudinaryAndCreateCloudinaryData(thumbNailFormData) as CloudinaryData;
                const khur = await prisma.knowhow.update({
                    where: {
                        id: knowhowSelected.id,
                    },
                    data: {
                        cloudinaryDataId: result?.id,
                    },
                    include: {
                        tags: true,
                        knowhowDetailInfo: true,
                        thumbnailCloudinaryData: true,
                    }
                });
                // console.log('knowhow updated:', khur);

            }

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
                            cloudinaryDatas: true,
                            // knowhowDetailOnCloudinaries: true,
                        }
                    });

                    console.log('knowhowdetailinfo updated:', khdiUpdateted);

                    if (imgFormData.length > 0) {
                        imgFormData?.forEach(async s => {
                            const file = s.get('file') as CloudinaryFile;
                            const imgUpload = await uploadImagesToCloudinaryAndCreateCloudinaryData(s) as CloudinaryData;
                            console.log('img upload result', imgUpload);
                            // if (imgUpload) {
                            //     const kdoc = await prisma.knowhowDetailOnCloudinary.create({
                            //         data: {
                            //             knowhowDetailInfoId: khdiUpdateted.id,
                            //             cloudinaryDataId: imgUpload.id
                            //         }
                            //     });
                            //     console.log('CloudinaryData: ', imgUpload);
                            // }
                        });
                    }

                    //! delete img cloudinary data
                    // const knowhowDetailOnCloudinaries = khdiUpdateted.knowhowDetailOnCloudinaries;
                    // let cls = knowhowDetailOnCloudinaries.map(s => s.cloudinaryDataId);

                    let ids: string[] = [];

                    // cloudinaryDataIdsToDelete?.forEach(s => {
                    //     const i = cls.indexOf(s);
                    //     const cd = knowhowDetailOnCloudinaries[i];
                    //     ids.push(cd.id);
                    // });

                    // ids?.forEach(async s => {
                    //     const dc = await prisma.knowhowDetailOnCloudinary.delete({
                    //         where: {
                    //             id: s,
                    //         }
                    //     });
                    //     console.log('deleted:', dc);
                    // });

                    // console.log('knowhow detail info updated: ', khdiUpdateted);

                    // consoleLogFormDatas('pdfFormData source: ', pdfFormData);

                    //! pdf 
                    // pdfFormData?.forEach(async pdfFormData => {

                    //     const pdfUpload = await uploadImagesToCloudinaryAndCreateCloudinaryData(pdfFormData) as CloudinaryData;
                    //     console.log('CloudinaryDataId: ', pdfUpload.id);
                    //     if (cls.some(s => s !== pdfUpload.id)) {
                    //         // ! create  KnowhowDetailOnCloudinary
                    //         const kdoc = await prisma.knowhowDetailOnCloudinary.create({
                    //             data: {
                    //                 knowhowDetailInfoId: khdiUpdateted.id,
                    //                 cloudinaryDataId: pdfUpload.id
                    //             }
                    //         });
                    //         // console.log('CloudinaryData added to knowhowdetailinfo: ', kdoc);
                    //     }
                    //     console.log('CloudinaryData already exists in knowhowdetailinfo', pdfUpload.id);


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
                    title: otherFormData?.get('title') as string,
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
                    thumbnailCloudinaryData: true,
                }
            });
            // console.log('knowhow created:', knowhow);
            let ytDataIds: string[] = [];
            ytData?.forEach(async yt => {
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
                    imgFormData?.forEach(async imgFormData => {
                        const imgUpload = await uploadImagesToCloudinaryAndCreateCloudinaryData(imgFormData) as CloudinaryData;
                        console.log('img upload result', imgUpload);

                        // ! create  KnowhowDetailOnCloudinary
                        // const kdoc = await prisma.knowhowDetailOnCloudinary.create({
                        //     data: {
                        //         knowhowDetailInfoId: knowhowDetail.id,
                        //         cloudinaryDataId: imgUpload.id
                        //     }
                        // });
                        // console.log('knowhowDetailOnCloudinary', kdoc);

                    });
                    console.log('pdf form data starting');

                    //! pdf 
                    pdfFormData?.forEach(async pdfFormData => {

                        const pdfUpload = await uploadImagesToCloudinaryAndCreateCloudinaryData(pdfFormData) as CloudinaryData;
                        // console.log('pdf upload result: ', pdfUpload);

                        // ! create  KnowhowDetailOnCloudinary
                        // const kdoc = await prisma.knowhowDetailOnCloudinary.create({
                        //     data: {
                        //         knowhowDetailInfoId: knowhowDetail.id,
                        //         cloudinaryDataId: pdfUpload.id
                        //     }
                        // });
                        // console.log('knowhowDetailOnCloudinary', kdoc);
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

// export async function updateKnowhowToSetParent(parentId: string, knowhow: Knowhow) {
//     try {
//     const kh = await prisma.knowhow.update({
//         where: {
//             id: knowhow.id,
//         },
//         data: {
//             parentId: parentId,
//             // parent: {
//             //     connect: {
//             //         id: parentId,
//             //     }
//             // },
//         },
//         include: {
//             parent: true,
//             children: true,
//         }

//     });
//         console.log('set parent ', kh)
//     } catch (error) {
//         console.log('update error:', error)
//     }

// }

const getProjectType = (value: string) => {
    if (value === "true") return true;
    return false;
}
const getGroupType = (value: string) => {
    if (value === "true") return true;
    return false;
}

export async function createStages(parent: Knowhow, stages: Stage[]) {
    try {
        if (parent === null || stages === null) {
            return;
        }

        if (stages.length > 0) {
            stages.forEach(async (stage: Stage, stageIndex: number) => {
                let stageId = stage.id;
                if (!stage.id) {
                    const s = await prisma.stage.create({
                        data: {
                            stageTitle: stage.stageTitle,
                            stage: stageIndex,
                            parentKnowhowId: parent.id,
                        }
                    })
                    stageId = s.id
                } else {
                    console.log('stage available: ', stageIndex)
                    stageId = stage.id;
                }
                if (stage.stageContents.length > 0) {

                    // console.log('stage contents: ', JSON.stringify(stage.stageContents))

                    stage.stageContents.forEach(async (child: StageContents, childIndex: number) => {

                        if (!child.id && child.title !== 'new') {
                            console.log('child to be created: ', stageIndex, childIndex)
                            const fd = child.thumbnailFormdata;
                            if (child.thumbnailFormdata) {
                                consoleLogFormData('child stage formdata: ', child.thumbnailFormdata);
                                const thumbnailCdId = await getThumbnailCloudinaryDataId(child.thumbnailFormdata) as string;
                                console.log('cloudinary Formdata:', thumbnailCdId)
                                const c = await prisma.stageContents.create({
                                    data: {
                                        title: child.title,
                                        description: child.description,
                                        stageId: stageId,
                                        cloudinaryDataId: thumbnailCdId,
                                    }
                                })
                                console.log('child created:', c)
                            }
                        } else if (child.isDeleted) {
                            const result = await prisma.stageContents.delete({
                                where: {
                                    id: child.id,
                                }
                            })
                            console.log('deleted stageContents result: ', result)
                        }

                        else {
                            console.log('child already created: ', stageIndex, childIndex)
                        }

                    })

                }
            });
        }
    } catch (error) {
        console.log('createKnowhow error:', error);
    }
}
export async function createChildKnowhow(parentId: string, stage: Stage, child: StageContents, stageProjectHeader: any | undefined) {
    if (!stageProjectHeader) {
        return;
    }
    const thumbnailCdId = await getThumbnailCloudinaryDataId(stageProjectHeader.thumbnailFormdata) as string;
    const index = stage.stageContents && stage.stageContents?.indexOf(child) > 0 ? stage.stageContents?.indexOf(child) : 0;
    const knowhow = await prisma.knowhow.create({
        data: {
            title: stage.stageTitle as string,
            stageTitle: stage.stageTitle,
            description: stageProjectHeader.description as string,
            authorId: stageProjectHeader.authorId as string,
            cloudinaryDataId: thumbnailCdId,
            stage: stage.stage,
            levelInStage: index,
            isProjectType: true,
            parentId: parentId,
        },
    });


    return knowhow;
}
export async function createGroupChildKnowhow(parentId: string, formData: any) {
    try {
        if (formData === null) {
            return;
        }

        const { otherFormData, thumbNailFormData } = formData;

        // consoleLogFormData('otherFormData', otherFormData)

        const thumbnailCdId = await getThumbnailCloudinaryDataId(thumbNailFormData) as string;
        const tagList = otherFormData.get('tags') as string;
        let tagConnect = await createTags(tagList) as any[];

        try {
            const kn = await prisma.knowhow.create({
                data: {
                    title: otherFormData?.get('title') as string,
                    description: otherFormData.get('description') as string,
                    knowHowTypeId: otherFormData.get('knowHowTypeId') as string,
                    categoryId: otherFormData.get('categoryId') as string,
                    authorId: otherFormData.get('authorId') as string,
                    isProjectType: getProjectType(otherFormData.get('isProjectType')),
                    isGroupType: getGroupType(otherFormData.get('isGroupType')),
                    cloudinaryDataId: thumbnailCdId,
                    parentId: parentId,
                    tags: {
                        connect: tagConnect,
                    },
                },
                include: {
                    tags: true,
                    parent: true,
                    children: true,
                }
            });
            return kn;
        } catch (error) {
            console.log('knowhow creation error(createKnowHow):', error);
        }
    } catch (error) {
        console.log('createKnowhow error:', error);
    }
}
export async function createKnowhow(formData: any) {
    try {
        if (formData === null) {
            return;
        }

        const { otherFormData, thumbNailFormData } = formData;

        // consoleLogFormData('otherFormData', otherFormData)

        const thumbnailCdId = await getThumbnailCloudinaryDataId(thumbNailFormData) as string;
        const tagList = otherFormData.get('tags') as string;
        let tagConnect = await createTags(tagList) as any[];

        try {
            const kn = await prisma.knowhow.create({
                data: {
                    title: otherFormData?.get('title') as string,
                    description: otherFormData.get('description') as string,
                    knowHowTypeId: otherFormData.get('knowHowTypeId') as string,
                    categoryId: otherFormData.get('categoryId') as string,
                    authorId: otherFormData.get('authorId') as string,
                    isProjectType: getProjectType(otherFormData.get('isProjectType')),
                    isGroupType: getGroupType(otherFormData.get('isGroupType')),
                    cloudinaryDataId: thumbnailCdId,
                    tags: {
                        connect: tagConnect,
                    }
                },
                include: {
                    tags: true,
                }
            });
            console.log('create Knowhow:', JSON.stringify(kn, null, 2))
            return kn;
        } catch (error) {
            console.log('knowhow creation error(createKnowHow):', error);
        }
    } catch (error) {
        console.log('createKnowhow error:', error);
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
async function getRootKnowhow() {
    const knowhows = await prisma.knowhow.findMany({
        where: {
            parent: null,
        },
        orderBy: [
            {
                createdAt: 'desc'
            }
        ],
        include: {
            tags: true,
            votes: true,
            knowhowDetailInfo: true,
            membershipRequest: true,
            author: true,
            children: true,
            parent: true,
            thumbnailCloudinaryData: true,
            bulletinBoards: true,

        }
    });
    return knowhows;
}

export async function getKnowhowsBy(registeredOrpaticipated: string | undefined | null, userId: string | undefined | null) {
    console.log('getKnowhowsBy', registeredOrpaticipated, userId)
    let knowhows: Array<Knowhow> = []
    if (registeredOrpaticipated === "registered" && userId) {
        knowhows = await prisma.knowhow.findMany({
            where: {
                authorId: userId
            },
            include: {
                tags: true,
                votes: true,
                knowhowDetailInfo: true,
                membershipRequest: true,
                author: true,
                children: true,
                thumbnailCloudinaryData: true,
            }
        })
    }
    if (registeredOrpaticipated === "paticipated" && userId) {
        const requestedBys = await prisma.membershipRequest.findMany({
            where: {
                membershipRequestedById: userId
            },
            include: {
                knowhow: {
                    include: {
                        tags: true,
                        votes: true,
                        knowhowDetailInfo: true,
                        membershipRequest: true,
                        author: true,
                        children: true,
                        thumbnailCloudinaryData: true,
                    }
                }
            }
        })
        requestedBys.forEach(s => {
            knowhows.push(s.knowhow)
        })
    }
    return knowhows;
}

export async function getKnowhows(searchBy: string | undefined | null,) {
    try {
        let knowhows: Array<Knowhow> = []
        if (searchBy === null || searchBy === undefined) {
            knowhows = await getRootKnowhow();
        } else if (searchBy === "놀기" || searchBy === "배우기" || searchBy === "만들기") {
            const category = await prisma.category.findFirst({
                where: {
                    name: searchBy
                }
            })
            if (category) {
                knowhows = await prisma.knowhow.findMany({
                    where: {
                        parent: null,
                        categoryId: category.id
                    },
                    orderBy: [
                        {
                            createdAt: 'desc'
                        }
                    ],
                    include: {
                        tags: true,
                        votes: true,
                        knowhowDetailInfo: true,
                        membershipRequest: true,
                        author: true,
                        children: {
                            include: {
                                knowhowDetailInfo: true,
                                thumbnailCloudinaryData: true,
                                author: true,
                            }
                        },
                        thumbnailCloudinaryData: true,
                    }
                });
            }
        }
        else {
            knowhows = await prisma.knowhow.findMany({
                where: {
                    parent: null,
                    title: {
                        contains: searchBy?.trim(),
                        mode: 'default',
                    }
                },
                include: {
                    tags: true,
                    votes: true,
                    knowhowDetailInfo: true,
                    membershipRequest: true,
                    author: true,
                    children: {
                        include: {
                            knowhowDetailInfo: true,
                            thumbnailCloudinaryData: true,
                            author: true,
                        }
                    },
                    thumbnailCloudinaryData: true,
                }
            });
        }
        return knowhows;
    }
    catch (error) {
        console.log(error);
        throw 'getKnowhows error:';
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
                category: true,
                thumbnailCloudinaryData: true,
                stages: {
                    orderBy: [
                        {
                            stage: 'asc'
                        }
                    ],
                    include: {
                        stageContents: {
                            include: {
                                thumbnailCloudinaryData: true,
                            }
                        }
                    },

                },
                membershipRequest: {
                    include: {
                        membershipRequestedBy: true,
                        membershipProcessedBy: true,
                    }
                },
                knowhowDetailInfo: {
                    include: {
                        youtubeDatas: true,
                        cloudinaryDatas: true,

                    },
                },
                children: {
                    include: {
                        thumbnailCloudinaryData: true,
                        author: true,
                    }
                },
            }
        });
        return knowhow;
    }
    catch (error) {
        console.log('getKnowhow', error);
        throw 'getKnowhow error:';
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
