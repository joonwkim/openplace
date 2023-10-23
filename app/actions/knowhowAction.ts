'use server';
import { revalidatePath } from "next/cache";
import { addKnowhowViewCount, createKnowHowWithDetailInfo, createKnowhow, updateKnowhow } from "../services/knowhowService";
import { } from "../services/tagService";
import { Knowhow, KnowhowDetailInfo } from "@prisma/client";
import { uploadFile } from "./cloudinary";

const getFormDataEntry = (formData: any) => {
  const oe = Object.fromEntries(formData.entries());
  return JSON.stringify(oe, null, 2);
};

export async function createKnowHowWithDetailAction(genFormData: any, knowhowDetailInfo: Omit<KnowhowDetailInfo, "id" | "knowHowId">, imgFormData: any[], pdfFormData: any[]) {

  const { otherFormData, thumbNailFormData } = genFormData;
  // console.log('otherFormData', getFormDataEntry(otherFormData));
  // console.log('thumbNailFormData', getFormDataEntry(thumbNailFormData));
  // console.log('knowhowDetailInfo', knowhowDetailInfo);
  // imgFormData.forEach(s => {
  //   console.log('imgFormData', getFormDataEntry(s));
  // });

  // pdfFormData.forEach(s => {
  //   console.log('pdfFormData', getFormDataEntry(s));
  // });

  try {

    await createKnowHowWithDetailInfo(otherFormData, knowhowDetailInfo);
    const res = await uploadFile(thumbNailFormData);

    imgFormData.forEach(async s => {
      const res = await uploadFile(s);
    });
    pdfFormData.forEach(async s => {
      const res = await uploadFile(s);
    });
    revalidatePath('/');

  } catch (error) {
    console.log(error);
  }

  revalidatePath('/');
}

export async function createKnowHowAction(data: FormData) {
  await createKnowhow(data);
  revalidatePath('/');
}
export async function updateKnowHowAction(data: Knowhow) {
  // console.log('update knowhow Action:', JSON.stringify(data, null, 2));
  await updateKnowhow(data);
  revalidatePath('/');
}
export async function addKnowhowViewCountAction(id: string, count: number) {
  await addKnowhowViewCount(id, count);
  revalidatePath('/');
}



