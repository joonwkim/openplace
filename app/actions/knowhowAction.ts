'use server';
import { revalidatePath } from "next/cache";
import { addKnowhowViewCount, createChildKnowHowWithDetailInfo, createKnowHowWithDetailInfo, createKnowhow, updateKnowHowWithDetailInfo, updateKnowhow } from "../services/knowhowService";
import { } from "../services/tagService";
import { Knowhow, KnowhowDetailInfo } from "@prisma/client";
import { consoleLogFormDatas } from "../lib/formdata";

export async function createChildKnowHowWithDetailAction(parentKnowhowId: string, genFormData: any, knowhowDetailInfo: Omit<KnowhowDetailInfo, "id" | "knowHowId">, ytData: any[], imgFormData: any[], pdfFormData: any[]) {
  // console.log('parentKnow in createChildKnowHowWithDetailAction', parentKnowhowId);
  const { otherFormData, thumbNailFormData } = genFormData;
  try {
    await createChildKnowHowWithDetailInfo(parentKnowhowId, otherFormData, knowhowDetailInfo);
    revalidatePath('/');

  } catch (error) {
    console.log('createChildKnowHowWithDetailAction error: ', error);
  }
  revalidatePath('/');
}
export async function updateKnowHowWithDetailAction(knowhow: Knowhow, genFormData: any, knowhowDetailInfo: Omit<KnowhowDetailInfo, "id" | "knowHowId">, ytData: any[], imgFormData: any[], cloudinaryDataIdsToDelete: string[], pdfFormData: any[]) {
  try {
    // console.log('ytData in updateKnowHowWithDetailAction: ', ytData);
    await updateKnowHowWithDetailInfo(knowhow, genFormData, knowhowDetailInfo, ytData, imgFormData, cloudinaryDataIdsToDelete, pdfFormData);
    revalidatePath('/');
  } catch (error) {
    console.log('updateKnowHowWithDetailAction error:', error);
  }
  revalidatePath('/');
}
export async function createKnowHowWithDetailAction(genFormData: any, knowhowDetailInfo: Omit<KnowhowDetailInfo, "id" | "knowHowId">, ytData: any[], imgFormData: any[], pdfFormData: any[]) {
  try {
    // consoleLogFormDatas('img form datas', imgFormData);

    await createKnowHowWithDetailInfo(genFormData, knowhowDetailInfo, ytData, imgFormData, pdfFormData);
    revalidatePath('/');
  } catch (error) {
    console.log('createKnowHowWithDetailAction error:', error);
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