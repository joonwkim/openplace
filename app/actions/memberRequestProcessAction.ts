'use server';
import { revalidatePath } from "next/cache";
import { createRequestForGroupMember, updateRequestProcess } from "../services/memberRequestProcessService";
import { MemberRequestAndProcess, MemberRequestAndProcessStatus } from "@prisma/client";

export async function createRequestProcessAction(authorizerId:string, requesterId: string, knowhowId: string) {
  await createRequestForGroupMember(authorizerId, requesterId, knowhowId);
  revalidatePath('/');
}

export async function updateRequestProcessAction({memberRequestProcess,status }:{ memberRequestProcess: MemberRequestAndProcess, status: MemberRequestAndProcessStatus}) {
  await updateRequestProcess({memberRequestProcess,status});
  revalidatePath('/notification');
}