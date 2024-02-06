import prisma from "@/prisma/prisma";
import { UpdateBulletinBoardFormProps } from "../[id]/components/BulletinBoard/types";

export async function getBulletinBoards(knowhowId: string) {
  try {
    const bbs = await prisma.bulletinBoard.findMany({
      where: {
        knowhowId: knowhowId,
      },
      include: {
        knowhow: true,
        user: true,
        comments: true,
      },
    });
    console.log(bbs);
    return bbs;
  } catch (error) {
    return { error };
  }
}

export async function createBulletinBoard(data: any) {
  const { title, message, knowhowId, userId } = data;
  try {
    return await prisma.bulletinBoard.create({
      data: {
        title,
        message,
        knowhow: {
          connect: {
            id: knowhowId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        user: true,
      },
    });
  } catch (error) {
    return { error };
  }
}

// export async function updateBulletinBoard(
//   data: UpdateBulletinBoardFormProps,
//   bulletinBoardId: string
// ) {
//   try {
//     return await prisma.bulletinBoard.update({
//       where: {
//         id: bulletinBoardId,
//       },
//       data: data,
//       include: {
//         user: true,
//       },
//     });
//   } catch (error) {
//     return { error };
//   }
// }
export async function deleteBulletinBoard(bulletinBoardId: string) {
  try {
    await prisma.bulletinBoard.delete({
      where: {
        id: bulletinBoardId,
      },
    });
    return true;
  } catch (error) {
    return { error };
  }
}

//sample
export async function getKnowhowById(knowid: string) {
  const knowhows = await prisma.knowhow.findFirst({
    where: {
      id: knowid,
    },
    orderBy: [
      {
        createdAt: "desc",
      },
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
      bulletinBoards: {
        include: {
          user: true,
          comments: {
            include: {
              parent: true,
              children: true,
            },
          },
        },
      },
    },
  });
  return knowhows;
}
