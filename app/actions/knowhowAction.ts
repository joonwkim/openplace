'use server'
import { revalidatePath } from "next/cache";
import { addKnowhowViewCount, createChildKnowhow, createGroupChildKnowhow, createKnowhow, createStageProjectKnowhow, updateGeneralKnowhow, updateKnowhow, updateKnowhowToSetParent } from "../services/knowhowService";
import { Knowhow, KnowhowDetailInfo } from "@prisma/client";
import { createAndUpdateKnowhowDetailInfo, createChildKnowhowDetailInfo, updateKnowhowDetailInfo, } from "../services/knowhowDetailInfoService";
import { consoleLogFormData } from "../lib/formdata";
import { Stage, StageProjectDetailData, StageProjectHeaderData } from "../lib/types";
import { getFontDefinitionFromNetwork } from "next/dist/server/font-utils";

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

export const updateStageProjectHeaderAndDetailAction = async (knowhow: Knowhow, genFormData: any, knowhowDetailInfo: Omit<KnowhowDetailInfo, "id" | "knowHowId">, ytData: any[], cdIds: string[], imgFormData: any[], pdfFormData: any[], stage: any, child: any, stageProjectHeader?: StageProjectHeaderData, stageProjectDetail?: StageProjectDetailData) => {
  await updateKnowhowDetailInfo(knowhow, knowhowDetailInfo, ytData, cdIds, imgFormData, pdfFormData);
  knowhow.isProjectType = true;
  await updateGeneralKnowhow(knowhow, genFormData);

  //create stage project header and details as child of the  knowhow
  //check stage project header contains all the value needed
  // -stage title
  // -stage description
  // -stage
  // -level in stage //! not included heare
  // thumbnail




  console.log('stage stageProjectHeader:', stageProjectHeader)

  const childKnowhow = await createChildKnowhow(knowhow.id, stage, child, stageProjectHeader) as Knowhow

  console.log('child knowhow:', childKnowhow)

  const spkdi = await createChildKnowhowDetailInfo(childKnowhow, stageProjectDetail)

  console.log('child knowhowdetail info:', spkdi)
  // await updateKnowhowToSetParent(knowhow.id, childKnowhow);


  // await createStageProjectKnowhow(knowhow, stageProjectHeaderData)
}

export async function createKnowhowWithDetailInfoAndStageAction(genFormData: any, knowhowDetailInfo: Omit<KnowhowDetailInfo, "id" | "knowHowId">, ytData: any[], imgFormData: any[], pdfFormData: any[], stages: Stage[]) {
  try {
    const knowhow = await createKnowhow(genFormData) as Knowhow;
    console.log('saved knowhow', knowhow)
    if (!knowhow) {
      return;
    }
    const khdi = await createAndUpdateKnowhowDetailInfo(knowhow, knowhowDetailInfo, ytData, imgFormData, pdfFormData);

    console.log('saved knowhow detail', khdi)

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