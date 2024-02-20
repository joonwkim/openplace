'use server'
import { revalidatePath } from "next/cache";
import { createMessage, } from "../services/messageService";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";


export async function createMessageAction(senderId: string, receiverId: string, message: string) {
    try {
        await createMessage(senderId, receiverId, message);
        revalidatePath('/message');
    } catch (error) {
        console.log(error)
    }

}
