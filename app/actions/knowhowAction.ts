'use server'
import { revalidatePath } from "next/cache";
import { addKnowhowViewCount, createKnowhow, updateGeneralKnowhow, updateKnowhow, updateKnowhowToSetParent } from "../services/knowhowService";
import { Knowhow, KnowhowDetailInfo } from "@prisma/client";
import { createAndUpdateKnowhowDetailInfo, updateKnowhowDetailInfo, } from "../services/knowhowDetailInfoService";

export async function createChildKnowHowWithDetailAction(parentKnowhowId: string, genFormData: any, knowhowDetailInfo: Omit<KnowhowDetailInfo, "id" | "knowHowId">, ytData: any[], imgFormData: any[], pdfFormData: any[]) {
  try {

    const knowhow = await createKnowhow(genFormData) as Knowhow;
    if (!knowhow) {
      return;
    }
    await updateKnowhowToSetParent(parentKnowhowId, knowhow);

    await createAndUpdateKnowhowDetailInfo(knowhow, knowhowDetailInfo, ytData, imgFormData, pdfFormData);

    revalidatePath('/');

  } catch (error) {
    console.log('createChildKnowHowWithDetailAction error: ', error);
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

    revalidatePath('/');
  } catch (error) {
    console.log('createKnowhowWithDetailInfoAction error:', error);
  }
  revalidatePath('/');
}

export async function updateKnowHowWithDetailInfoAction(knowhow: Knowhow, genFormData: any, knowhowDetailInfo: Omit<KnowhowDetailInfo, "id" | "knowHowId">, ytData: any[], cdIds: string[], imgFormData: any[], pdfFormData: any[]) {
  try {

    await updateKnowhowDetailInfo(knowhow, knowhowDetailInfo, ytData, cdIds, imgFormData, pdfFormData);

    await updateGeneralKnowhow(knowhow, genFormData);

    revalidatePath('/');
  } catch (error) {
    console.log('updateKnowHowWithDetailAction error:', error);
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