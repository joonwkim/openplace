'use server';

import { Knowhow, User, Vote } from "@prisma/client";
import { getKnowHows, updateKnowhow } from "../services/knowhowService";
import { createtVoteAndUpdateKnowHow } from "../services/voteService";
import { stat } from "fs";
import { revalidatePath } from "next/cache";
import { VoteData } from "../components/knowHowItem";

export async function createVoteActionAndUpdateKnowHow(knowhow: Knowhow, logInUser: User, voteInput: VoteData) {
    try {

        // console.log('voteInput: ', JSON.stringify(voteInput, null, 2));
        const rslt = await createtVoteAndUpdateKnowHow(knowhow, logInUser, voteInput)
        const updated = await updateKnowhow(knowhow)
        revalidatePath('/')

    } catch (error) {
        console.log('createVoteActionAndUpdateKnowHow error');
        // console.log(error)
        // return ({ error })
    }
}