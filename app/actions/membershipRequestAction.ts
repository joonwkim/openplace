'use server';
import { revalidatePath } from "next/cache";
import { createMembershipRequest, updateMembershipRequest } from "../services/membershipRequestService";
import { StatusChanged } from "../notification/components/request";

export async function createMembershipRequestAction(authorizerId: string, requesterId: string, knowhowId: string) {
  await createMembershipRequest(authorizerId, requesterId, knowhowId);
  revalidatePath('/');
}

export async function updatemembershipRequestAction(statusChanged: any[]) {
  await updateMembershipRequest(statusChanged);
  revalidatePath('/');
}