'use server';
import { MembershipRequestStatus } from "@prisma/client";
import { StatusChanged } from "../notification/components/request";

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

export async function updateMembershipRequest(statusChanged: any[]) {
    if (statusChanged === null || statusChanged.length === 0) return;
    try {

        statusChanged.forEach(async (s: any) => {
            // console.log('statusChanged: ', s);
            const res = await prisma?.membershipRequest.update({
                where: {
                    id: s.id,
                },
                data: {
                    membershipRequestStatus: s.value,
                    processedAt: new Date()
                }
            });
            // console.log('status changed:', res);
        });

    } catch (error) {
        console.log('updateMembershipRequest error: ', error);
        throw error;
    }
    return '';
}


