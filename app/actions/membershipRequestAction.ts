'use server';
import { revalidatePath } from "next/cache";
import { createMembershipRequest, updateMembershipRequest } from "../services/membershipRequestService";
import { MembershipRequest, MembershipRequestStatus } from "@prisma/client";

export async function createMembershipRequestAction(authorizerId: string, requesterId: string, knowhowId: string) {
  // console.log('createMembershipRequestAction');
  await createMembershipRequest(authorizerId, requesterId, knowhowId);
  revalidatePath('/');
}

export async function updatemembershipRequestAction({ membershipRequestProcess, status }: { membershipRequestProcess: MembershipRequest, status: MembershipRequestStatus; }) {
  await updateMembershipRequest({ membershipRequestProcess, status });
  revalidatePath('/notification');
}