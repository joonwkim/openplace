'use server'
import prisma from '@/prisma/prisma'
import { Knowhow, ThumbsStatus, User, Vote } from '@prisma/client'
import exp from 'constants';
import { disconnect } from 'process';
import { VoteData } from '../components/knowHowItem';

export async function getKnowHows() {
    return await prisma.knowhow.findMany({
        include: {
            votes: true,
        }
    })
}
export async function createtVoteAndUpdateKnowHow(knowhow: Knowhow, voter: User, voteInput: VoteData) {
    // console.log('voter:', JSON.stringify(voter,null,2))
    if(voter === undefined || voteInput ===null){
        // console.log('undefined')
        return;
    }
    let vote = await prisma.vote.findFirst({
        where: {
            knowHowId: knowhow?.id,
            voterId: voter?.id
        }
    })
    // console.log('vote retreived from db:', JSON.stringify(vote,null,2))
    
    if (vote !== null) {
        //update vote
        if (vote.thumbsStatus !== voteInput.thumbsStatus || vote.forked !== voteInput.forked) {
            if (voteInput.thumbsStatus === ThumbsStatus.None && voteInput.forked === false) {
                const result = await prisma.vote.delete({
                    where: {
                        id: vote.id,
                    },
                })
                console.log('vote deleted')
            }
            else {
                const result = await prisma.vote.update({
                    where: {
                        id: vote.id,
                    },
                    data: {
                        thumbsStatus: voteInput.thumbsStatus,
                        forked: voteInput.forked,
                    }
                })
                console.log("vote updated", JSON.stringify(result, null,2))
            }
        } 
    }
    else if (vote === null) {
        //create vote
        if (voteInput.thumbsStatus !== ThumbsStatus.None || voteInput.forked === true) {
            vote = await prisma.vote.create({
                data: {
                    thumbsStatus: voteInput.thumbsStatus,
                    forked: voteInput.forked,
                    voter: {
                        connect: {
                            id: voter.id,
                        }
                    },
                    knowhow: {
                        connect: {
                            id: knowhow.id
                        }
                    }
                },
            })
            console.log('vote created', JSON.stringify(vote,null,2));
        }
    }
}

export async function getVote(knowhow: Knowhow, voter: User) {
    try {
        // console.log('get votes : ', knowhow.id, voter.id)
        const vote = await prisma.vote.findFirst({
            where: {
                voterId: voter.id,
                knowHowId: knowhow.id,
            }
        })
        // console.log('get votes : ', JSON.stringify(vote, null, 2))
    } catch (error) {
        console.log('error : ', error)
        return ({ error })
    }
}
// const formDataObj = Object.fromEntries(voteInput.entries());
// console.log('formDataObj', JSON.stringify(formDataObj, null, 2) )
// console.log('voteInput', JSON.stringify(voteInput, null, 2) )
// voteInput.set("voterId", logInUser.id);
