'use server'
import { revalidatePath } from "next/cache";
import { createMessage, } from "../services/messageService";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { createBulletin, createCommentsOnBulletin } from "../services/bulletinBoardService";


export async function createBulletinAction(knowhowId: string, writerId: string, title: string, message: string) {
    try {
        await createBulletin(knowhowId, writerId, title, message);
        revalidatePath('/')
        // revalidatePath(`/${knowhowId}`);
    } catch (error) {
        console.log(error)
    }
}
export async function createCommentsOnBulletinAction(bulletinBoardId: string, parentCommentId: string | null, writerId: string, comment: string) {
    try {
        await createCommentsOnBulletin(bulletinBoardId, parentCommentId, writerId, comment);
        revalidatePath('/');
    } catch (error) {
        console.log(error)
    }
}
