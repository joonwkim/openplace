import prisma from '@/prisma/prisma'
import { Tag } from '@prisma/client';
import { getAllJSDocTags } from 'typescript';

export async function getTags() {
    try {
        const tags = await prisma.tag.findMany()
        return tags
    } catch (error) {
        return ({ error })
    }
}


export async function getTagsByName(tagsInput: string) {
    try {
        // console.log("tags in getTagIds: ", tagsInput)
        const tagNames = tagsInput.split(" ");
        let tags:Tag[] = [];
        tagNames.forEach(async (t) =>{
            const tag = await prisma.tag.findUnique({
                where:{
                    name: t,
                }
            })
            if(tag !==null){
                tags.push(tag)
                // console.log("tag in getTagIds: ", tag)
            }
        })
        // console.log("tags in getTagsByName: ", tags)
       return tags;
    } catch (error) {
        return ({ error })
    }
}


export async function deleteTagsAll() {
    const result = await prisma.tag.deleteMany({});
    return result;
}

export async function createTags(input: string | undefined): Promise<Tag[] | undefined> {
    const tags: Tag[] = []
    if (input) {
        const tagNames = input?.toLowerCase().split(' ');
        tagNames?.forEach(async (name) => {
            const tag = await createTag(name.toLowerCase());
            if (tag) {
                tags.push(tag)
                // console.log('tags on map:', JSON.stringify(tags))
            }
        })
        // console.log('tagIds on createTags:', JSON.stringify(tags))
        return tags;
    }
}

export async function upsertTag(tagName: string) {
    try {

        const tag = prisma.tag.upsert({
            where: {
                name: tagName.trim()
            },
            create: {
                name: tagName,
            },
            update: {

            }
        })
        return tag;
    } catch (error) {
        console.log('createTag error:', error)
    }
}

export async function createTagIds(input: string | undefined): Promise<string[] | undefined> {
    try {
        const tagIds: string[] = []
        if (input) {
            const tagNames = input?.split(' ');
            tagNames?.forEach(async (name) => {
                const tag = await createTag(name.toLowerCase());
                if (tag) {
                    tagIds.push(tag.id)
                    // console.log('tagIds on map:', JSON.stringify(tagIds))
                }
            })
            // console.log('tagIds on createTags:', JSON.stringify(tagIds))
            return tagIds;
        }
    } catch (error) {
        console.log('create Tag Id Error:', error)
    }
}


export async function createTestTag() {
    const tt = ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10"]
    let tags: any[] = [];
    tt.map((t) => {
        const tag = createTag(t);
        // console.log('tag in createTestTag:', JSON.stringify(tag, null, 2))
        tags.push(tag);
    });

    // console.log('tags:', JSON.stringify(tags, null, 2))
    return tags;

}

const getLastWord = (searchText: string) => {
    return searchText.trim().split(" ").pop();
}

const getFilters = (searchText: string) => {
    const words = searchText.split(" ");
    // console.log('words:', words)
    return words;
}

export async function createTag(input: string) {
    try {
        let tagName = getLastWord(input)?.toLocaleLowerCase()
        // console.log('input create tag:', JSON.stringify(tagName,null,2))
        if (!tagName || tagName.length < 2)
            return;
        const tag = await prisma.tag.findUnique({
            where: {
                name: tagName,
            }
        })
        if (tag) {
            // console.log('tag found:', JSON.stringify(tag, null, 2))
            return tag;
        } else {
            // console.log('tag not found:', tagName)
            const newTag = await prisma.tag.create({
                data: {
                    name: tagName
                },
            })
            // console.log('newTag:', JSON.stringify(newTag, null, 2))
            return newTag;
        }
    } catch (error) {
        console.log('createTag error:', error)
    }
}

function removeItemsWithName(items: Tag[], name: string): Tag[] {
    return items.filter(i => i.name !== name);
}

export async function getTagsStartsWith(searchTag: string) {
    if (searchTag) {
        let filtered: Tag[] = []
        const filters = getFilters(searchTag);
        // console.log('filters:', filters)
        const lastWord = getLastWord(searchTag) as string

        const index = filters.indexOf(lastWord, 0);
        if (index > -1) {
            filters.splice(index, 1);
        }

        // console.log('lastWord:', lastWord)
        let tags = await prisma.tag.findMany({
            where: {
                name: {
                    startsWith: lastWord,
                    mode: 'insensitive',
                }
            }
        })

        filters.forEach(f=>{
            tags = removeItemsWithName(tags, f)
        })

        // console.log('tags:', JSON.stringify(tags,null,2));
        return tags;


    }

    else
        return null;
}