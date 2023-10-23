'use server'

import { revalidatePath } from "next/cache"
import { createTag, getTagsStartsWith, } from "../services/tagService"
import SearchBar from "@/components/controls/searchBar";
import { JsonWebTokenError } from "jsonwebtoken";

export async function createTagAction(tagName: string) {
    if (!tagName)
        return;
    // console.log('createTagAction', tagName)
  const tag = await createTag(tagName);
  return tag;
    // revalidatePath('/regContents')
}

export async function getTagsBySearchTextAction(serchText: string){
   const result = await getTagsStartsWith(serchText)
  //  console.log('getTagsBySearchTextAction', JSON.stringify(result,null,2))
   return result;
}