'use server'
import { revalidatePath } from "next/cache";
import { createBulletin, createCommentsOnBulletin } from "../services/bulletinBoardService";

export async function createBulletinAction(knowhowId: string, writerId: string, title: string, message: string) {
    try {
        await createBulletin(knowhowId, writerId, title, message);
        revalidatePath('/')
    } catch (error) {
        console.log(error)
    }
}
export async function createCommentOnBulletinAction(bulletinBoardId: string, parentCommentId: string | null, writerId: string, comment: string) {
    try {
        await createCommentsOnBulletin(bulletinBoardId, parentCommentId, writerId, comment);
        revalidatePath('/');
        return true;
    } catch (error) {
        console.log(error)
    }
}
