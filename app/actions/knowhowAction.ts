'use server'
import { revalidatePath } from "next/cache";
import { addKnowhowViewCount, createChildKnowhow, createGroupChildKnowhow, createKnowhow, createStages, updateGeneralKnowhow, updateKnowhow, } from "../services/knowhowService";
import { Knowhow, KnowhowDetailInfo } from "@prisma/client";
import { createAndUpdateKnowhowDetailInfo, createChildKnowhowDetailInfo, updateKnowhowDetailInfo, } from "../services/knowhowDetailInfoService";
import { consoleLogFormData } from "../lib/formdata";
import { Stage } from "../lib/types";
import { getFontDefinitionFromNetwork } from "next/dist/server/font-utils";
// import { getKnowhowById } from "../services/bulletinBoardService";

export async function createChildKnowHowWithDetailAction(parentKnowhowId: string, genFormData: any, knowhowDetailInfo: Omit<KnowhowDetailInfo, "id" | "knowHowId">, ytData: any[], imgFormData: any[], pdfFormData: any[]) {
  try {
    const knowhow = await createGroupChildKnowhow(parentKnowhowId, genFormData)
    // await updateKnowhowToSetParent(parentKnowhowId, knowhow);
    if (knowhow) {
      await createAndUpdateKnowhowDetailInfo(knowhow, knowhowDetailInfo, ytData, imgFormData, pdfFormData);
    }   
  } catch (error) {
    throw error;
  }
  revalidatePath('/');
}

export const updateKnowhowAndDetailStagesAction = async (knowhow: Knowhow, genFormData: any, knowhowDetailInfo: Omit<KnowhowDetailInfo, "id" | "knowHowId">, ytData: any[], cdIds: string[], imgFormData: any[], pdfFormData: any[], stages: Stage[],) => {
  await updateKnowhowDetailInfo(knowhow, knowhowDetailInfo, ytData, cdIds, imgFormData, pdfFormData);
  await updateGeneralKnowhow(knowhow, genFormData);
  const results = await createStages(knowhow, stages);
}

export async function createKnowhowWithDetailInfoAndStageAction(genFormData: any, knowhowDetailInfo: Omit<KnowhowDetailInfo, "id" | "knowHowId">, ytData: any[], imgFormData: any[], pdfFormData: any[], stages: Stage[]) {
  try {
    // console.log('createKnowhowWithDetailInfoAndStageAction')
    const knowhow = await createKnowhow(genFormData) as Knowhow;
    if (!knowhow) {
      return;
    }
    await createAndUpdateKnowhowDetailInfo(knowhow, knowhowDetailInfo, ytData, imgFormData, pdfFormData);
    const results = await createStages(knowhow, stages);

    revalidatePath('/');


  } catch (error) {
    console.log('createKnowhowWithDetailInfoAndStageAction error:', error);
    throw error
  }
  revalidatePath('/');
}
export async function createKnowhowWithDetailInfoAction(genFormData: any, knowhowDetailInfo: Omit<KnowhowDetailInfo, "id" | "knowHowId">, ytData: any[], imgFormData: any[], pdfFormData: any[]) {
  try {
    const knowhow = await createKnowhow(genFormData) as Knowhow;
    if (!knowhow) {
      return;
    }
    await createAndUpdateKnowhowDetailInfo(knowhow, knowhowDetailInfo, ytData, imgFormData, pdfFormData);
  } catch (error) {
    console.log('createKnowhowWithDetailInfoAction error:', error);
    throw error
  }
  revalidatePath('/');
}


export const updateKnowHowWithDetailInfoAction = async (knowhow: Knowhow, genFormData: any, knowhowDetailInfo: Omit<KnowhowDetailInfo, "id" | "knowHowId">, ytData: any[], cdIds: string[], imgFormData: any[], pdfFormData: any[]) => {
  try {
    await updateKnowhowDetailInfo(knowhow, knowhowDetailInfo, ytData, cdIds, imgFormData, pdfFormData);
    await updateGeneralKnowhow(knowhow, genFormData);
    revalidatePath('/');

  } catch (error) {
    console.log('updateKnowHowWithDetailAction error:', error);
    throw error;
  }
  revalidatePath('/');
}

export async function createKnowHowAction(data: FormData) {
  await createKnowhow(data);
  revalidatePath('/');
}
export async function updateKnowHowAction(data: Knowhow) {
  await updateKnowhow(data);
  revalidatePath('/');
}
export async function addKnowhowViewCountAction(id: string, count: number) {
  await addKnowhowViewCount(id, count);
  revalidatePath('/');
}