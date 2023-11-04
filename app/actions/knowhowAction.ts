'use server';
import { revalidatePath } from "next/cache";
import { addKnowhowViewCount, createChildKnowHowWithDetailInfo, createKnowHowWithDetailInfo, createKnowhow, updateKnowhow } from "../services/knowhowService";
import { } from "../services/tagService";
import { Knowhow, KnowhowDetailInfo } from "@prisma/client";
import { getAssetResources, uploadFile, uploadImage } from "./cloudinary";
import { createCloudinaryData, getCloudinaryAndSave, getCloudinaryData } from "../services/cloudinaryService";
import { CloudiaryInfo } from "../lib/convert";
import { log } from "console";

const getFormDataEntry = (formData: any) => {
  const oe = Object.fromEntries(formData.entries());
  return JSON.stringify(oe, null, 2);
};

// process to be changed
// get images from cloudinary and save them to cloudinarydata table as initial data
// check if image is already uploaded by filename and folder from cloudinarydata table
// if is already uploaded, get secure_url from cloudinaryData
// upload images to cloudinary first then create cloudinary data 
// 

export async function createChildKnowHowWithDetailAction(parentKnowhowId: string, genFormData: any, knowhowDetailInfo: Omit<KnowhowDetailInfo, "id" | "knowHowId">, imgFormData: any[], pdfFormData: any[]) {
  // console.log('parentKnow in createChildKnowHowWithDetailAction', parentKnowhowId);
  const { otherFormData, thumbNailFormData } = genFormData;
  try {
    await createChildKnowHowWithDetailInfo(parentKnowhowId, otherFormData, knowhowDetailInfo);
    revalidatePath('/');

  } catch (error) {
    console.log(error);
  }
  revalidatePath('/');
}
export async function createKnowHowWithDetailAction(genFormData: any, knowhowDetailInfo: Omit<KnowhowDetailInfo, "id" | "knowHowId">, imgFormData: any[], pdfFormData: any[]) {
  // const { otherFormData, thumbNailFormData } = genFormData;
  try {
    await createKnowHowWithDetailInfo(genFormData, knowhowDetailInfo, imgFormData, pdfFormData);
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
  await updateKnowhow(data);
  revalidatePath('/');
}
export async function addKnowhowViewCountAction(id: string, count: number) {
  await addKnowhowViewCount(id, count);
  revalidatePath('/');
}



