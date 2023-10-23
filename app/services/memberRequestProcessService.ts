'use server';
import { MemberRequestAndProcess, MemberRequestAndProcessStatus } from "@prisma/client";

export async function createRequestForGroupMember(authorizerId: string, requesterId: string, knowhowId: string) {
    try {
        if (!requesterId || !knowhowId) return;
        const ex = await prisma?.memberRequestAndProcess.findFirst({
            where:{
                memberProcessedById: authorizerId,
                memberRequestedById: requesterId,
                knowhowId: knowhowId,
            }
        })
        if(!ex){
            const request = await prisma?.memberRequestAndProcess.create({
                data: {
                    memberRequestStatus: MemberRequestAndProcessStatus.REQUESTED,
                    memberProcessedById: authorizerId,
                    memberRequestedById: requesterId,
                    knowhowId: knowhowId,
                },
            });
            console.log('request:',request)
        }else{
            console.log('request and process:','already exists')
        }
    } catch (error) {
        console.log(error);
    }

}

export async function getMemberRequests(memberProcessedById: string) {
    const res = await prisma?.memberRequestAndProcess.findMany({
        where: {
            id: memberProcessedById
        },
        include: {
            knowhow: true,
            memberRequestedBy: true,
        }
    });
    console.log('member requested: ', res);
    return res;
}

export async function updateRequestProcess({memberRequestProcess,status }:{ memberRequestProcess: MemberRequestAndProcess, status: MemberRequestAndProcessStatus}) {
    if (memberRequestProcess === null) return;
    try {
        const res =await prisma?.memberRequestAndProcess.update({
            where:{
                id:memberRequestProcess.id,
            },
            data:{
                memberRequestStatus: status,
                processedAt:new Date()
            }
        })
        console.log('updated:', res);
        return res;
    } catch (error) {
        
    }
    return '';
}

