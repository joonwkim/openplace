'use client'
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

type TagProps = {
    tags: any[],
    searchParams: { searchText: string, category: string; myhome: string; id: string, selectedTagList: string },
}

const TagList = (props: TagProps) => {
    const { tags, searchParams } = props;
    const { searchText, category, myhome, id } = searchParams;
    const [tagList, setTagList] = useState(tags)
    const router = useRouter();
    // const pathname = usePathname()
    const handleClicked = (tag: any, value: any) => {
        tag.checked = value;
        const seletedTags = tagList.filter(s => s.checked === true).map(s => s.id);
        const seletedTagsId = seletedTags.join(',')
        console.log('ts:', seletedTagsId)
        console.log('search parms:', JSON.stringify(searchParams, null, 2))
        if (searchText) {
            router.push(`/?${searchText}&selectedTagList=${seletedTagsId}`);
        } else if (category) {
            router.push(`/?${category}&selectedTagList=${seletedTagsId}`);
        } else if (myhome) {
            router.push(`/?${myhome}&selectedTagList=${seletedTagsId}`);
        } else {
            router.push(`/?selectedTagList=${seletedTagsId}`);
        }

        // router.push(`/${pathname}`);
    }
    return (<>
        <div className='d-flex  mt-2'>
            <div className='me-2'>Tags:</div>
            {tagList.length > 0 && tagList.map((tag, index) => (
                <div key={tag.id} className="form-check mx-2">
                    <input className="form-check-input" type="checkbox" value={tag.checked} id={tag.id} title={tag.name} onChange={(e) => handleClicked(tag, e.target.checked)} />
                    <label className="form-check-label ms-0" title={tag.name}>
                        {tag.name},
                    </label>
                </div>
            ))}
        </div>
    </>)
}
export default TagList; 
