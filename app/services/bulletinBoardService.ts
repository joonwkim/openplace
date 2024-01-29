import prisma from '@/prisma/prisma'

export async function getBulletinBoards() {
    try {
        const bbs = await prisma.bulletinBoard.findMany({
            include: {
                knowhow: true,
                user: true,
                comments: true,
            }
        })
        // console.log(categories)
        return bbs
    } catch (error) {
        return ({ error })
    }
}

//sample
// export async function getKnowhowById(knowid: string) {
//     const knowhows = await prisma.knowhow.findFirst({
//         where: {
//             id: knowid,
//         },
//         orderBy: [
//             {
//                 createdAt: 'desc'
//             }
//         ],
//         include: {
//             tags: true,
//             votes: true,
//             knowhowDetailInfo: true,
//             membershipRequest: true,
//             author: true,
//             children: true,
//             parent: true,
//             thumbnailCloudinaryData: true,
//             bulletinBoards: {
//                 include: {
//                     user: true,
//                     comments: {
//                         include: {
//                             parent: true,
//                             children: true,
//                         }
//                     }
//                 }
//             }
//         }
//     });
//     return knowhows;
// }