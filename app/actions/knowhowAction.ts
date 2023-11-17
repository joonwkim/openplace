'use server';
import { revalidatePath } from "next/cache";
import { addKnowhowViewCount, createKnowhow, updateGeneralKnowhow, updateKnowhow, updateKnowhowToSetParent } from "../services/knowhowService";
import { } from "../services/tagService";
import { Knowhow, KnowhowDetailInfo } from "@prisma/client";
import { consoleLogFormDatas } from "../lib/formdata";
import { getYtDataIds, } from "../services/youtubeService";
import { createAndUpdateKnowhowDetailInfo, updateCdIdsOfKnowHowDetailInfo, updateKnowHowDetailInfo, updateKnowhowDetailInfo, } from "../services/knowhowDetailInfoService";
import { getYoutubeData } from "../lib/convert";
import { getAndUpdateCloudinaryDataIds } from "../services/cloudinaryService";

export async function createChildKnowHowWithDetailAction(parentKnowhowId: string, genFormData: any, knowhowDetailInfo: Omit<KnowhowDetailInfo, "id" | "knowHowId">, ytData: any[], imgFormData: any[], pdfFormData: any[]) {
  // console.log('parentKnow in createChildKnowHowWithDetailAction', parentKnowhowId);
  const { otherFormData, thumbNailFormData } = genFormData;
  try {

    const knowhow = await createKnowhow(genFormData) as Knowhow;
    if (!knowhow) {
      return;
    }
    await updateKnowhowToSetParent(parentKnowhowId, knowhow);

    await createAndUpdateKnowhowDetailInfo(knowhow, knowhowDetailInfo, ytData, imgFormData, pdfFormData);

    // let ytDataIds: string[] = [];
    // if (ytData.length > 0) {
    //   ytDataIds = await getYtDataIds(ytData);
    //   // console.log('ytDataIds:', ytDataIds);
    // }

    // const khdi = await createKnowhowDetailInfo(knowhow, knowhowDetailInfo, ytDataIds);

    // if (khdi) {
    //   await updateKnowhowCloudinaryDataIds(imgFormData, knowhow.id);
    //   await updateKnowhowCloudinaryDataIds(pdfFormData, knowhow.id);
    // }

    // await createChildKnowHowWithDetailInfo(parentKnowhowId, otherFormData, knowhowDetailInfo);
    revalidatePath('/');

  } catch (error) {
    console.log('createChildKnowHowWithDetailAction error: ', error);
  }
  revalidatePath('/');
}

export async function createKnowhowWithDetailInfoAction(genFormData: any, knowhowDetailInfo: Omit<KnowhowDetailInfo, "id" | "knowHowId">, ytData: any[], imgFormData: any[], pdfFormData: any[]) {
  try {
    // consoleLogFormDatas('img form datas', imgFormData);

    const knowhow = await createKnowhow(genFormData) as Knowhow;
    if (!knowhow) {
      return;
    }

    await createAndUpdateKnowhowDetailInfo(knowhow, knowhowDetailInfo, ytData, imgFormData, pdfFormData);
    // let ytDataIds: string[] = [];
    // if (ytData.length > 0) {
    //   ytDataIds = await getYtDataIds(ytData);
    //   // console.log('ytDataIds:', ytDataIds);
    // }

    // const khdi = await createKnowhowDetailInfo(knowhow, knowhowDetailInfo, ytDataIds);

    // if (khdi) {
    //   await updateKnowhowCloudinaryDataIds(imgFormData, knowhow.id);
    //   await updateKnowhowCloudinaryDataIds(pdfFormData, knowhow.id);
    // }

    // await createKnowHowWithDetailInfo(genFormData, knowhowDetailInfo, ytData, imgFormData, pdfFormData);
    revalidatePath('/');
  } catch (error) {
    console.log('createKnowhowWithDetailInfoAction error:', error);
  }
  revalidatePath('/');
}

export async function updateKnowHowWithDetailInfoAction(knowhow: Knowhow, genFormData: any, knowhowDetailInfo: Omit<KnowhowDetailInfo, "id" | "knowHowId">, ytData: any[], cdIds: string[], imgFormData: any[], pdfFormData: any[]) {
  try {

    // console.log('knowhow', JSON.stringify(knowhow, null, 2));
    // console.log('cdIds:', cdIds);

    // const updatedKnowhow = await updateGeneralKnowhow(knowhow, genFormData);
    // console.log(updatedKnowhow);
    // consoleLogFormDatas('imgFormData:', imgFormData);
    await updateKnowhowDetailInfo(knowhow, knowhowDetailInfo, ytData, cdIds, imgFormData, pdfFormData);

    await updateGeneralKnowhow(knowhow, genFormData);

    // let ytDataIds: string[] = [];
    // if (ytData.length > 0) {
    //   ytDataIds = await getYtDataIds(ytData);
    // }


    // let imgcloudinaryDataIds: string[] = [];
    // if (imgFormData.length > 0) {
    //   imgcloudinaryDataIds = await getAndUpdateCloudinaryDataIds(imgFormData, knowhow.id);

    //   console.log('imgcloudinaryDataIds:', imgcloudinaryDataIds);
    // }


    // let pdfcloudinaryDataIds: string[] = [];
    // if (pdfFormData.length > 0) {
    //   pdfcloudinaryDataIds = await getAndUpdateCloudinaryDataIds(pdfFormData, knowhow.id);

    //   console.log('pdfcloudinaryDataIds:', imgcloudinaryDataIds);
    // }

    // if (genFormData !== null && genFormData !== undefined) {
    //   await updateGeneralKnowhow(knowhow, genFormData);
    // }

    // if (knowhowDetailInfo !== null) {
    //   await updateKnowHowDetailInfo(knowhow?.id, knowhowDetailInfo, ytDataIds);
    // }

    // const merged = [...imgcloudinaryDataIds, ...pdfcloudinaryDataIds, ...cdIds];
    // const uniqueCdIds = [...new Set(merged)];
    // console.log('uniqueCdIds', uniqueCdIds);
    // await updateCdIdsOfKnowHowDetailInfo(knowhow?.id, uniqueCdIds);

    // await updateKnowHowWithDetailInfo(knowhow, genFormData, knowhowDetailInfo, ytData, imgFormData, cloudinaryDataIdsToDelete, pdfFormData);
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