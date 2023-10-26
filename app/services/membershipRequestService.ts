'use server';
import { MembershipRequest, MembershipRequestStatus } from "@prisma/client";

export async function createMembershipRequest(authorizerId: string, requesterId: string, knowhowId: string) {
    try {
        if (!requesterId || !knowhowId) return;
        const ex = await prisma?.membershipRequest.findFirst({
            where: {
                membershipProcessedById: authorizerId,
                membershipRequestedById: requesterId,
                knowhowId: knowhowId,
            }
        });
        if (!ex) {
            const request = await prisma?.membershipRequest.create({
                data: {
                    membershipRequestStatus: MembershipRequestStatus.REQUESTED,
                    membershipProcessedById: authorizerId,
                    membershipRequestedById: requesterId,
                    knowhowId: knowhowId,
                },
            });
            console.log('request created:', request);
        } else {
            console.log('request exists:', ex);
        }
    } catch (error) {
        console.log(error);
    }

}

export async function getMembershipRequests(membershipProcessedById: string) {
    const res = await prisma?.membershipRequest.findMany({
        where: {
            id: membershipProcessedById
        },
        include: {
            knowhow: true,
            membershipRequestedBy: true,
        }
    });
    console.log('member requested: ', res);
    return res;
}

export async function updateMembershipRequest({ membershipRequestProcess, status }: { membershipRequestProcess: MembershipRequest, status: MembershipRequestStatus; }) {
    if (membershipRequestProcess === null) return;
    try {
        const res = await prisma?.membershipRequest.update({
            where: {
                id: membershipRequestProcess.id,
            },
            data: {
                membershipRequestStatus: status,
                processedAt: new Date()
            }
        });
        console.log('updated:', res);
        return res;
    } catch (error) {

    }
    return '';
}

