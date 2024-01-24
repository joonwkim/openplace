'use server';
import { revalidatePath } from "next/cache";
import { createMembershipRequest, updateMembershipRequest, updateRequestResponse } from "../services/membershipRequestService";
import { StatusChanged } from "../notification/components/request";
import { MembershipRequestStatus } from "@prisma/client";

export async function createMembershipRequestAction(authorizerId: string, requesterId: string, knowhowId: string) {
  await createMembershipRequest(authorizerId, requesterId, knowhowId);
  revalidatePath('/');
}

export async function updatemembershipRequestAction(statusChanged: any[]) {
  await updateMembershipRequest(statusChanged);
  revalidatePath('/');
}
export async function updateMembershipRequestAction(requestId: string, status: MembershipRequestStatus) {
  await updateRequestResponse(requestId, status);
  revalidatePath('/');
}