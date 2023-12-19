'use client'
import { useRouter, } from 'next/navigation';
import { useRef, useState } from 'react';

type TagProps = {
    tags: any[],
    searchParams: { searchText: string, category: string; myhome: string; id: string, selectedTagList: string },
}

const TagList = (props: TagProps) => {
    const { tags, searchParams } = props;
    const { searchText, category, myhome, id } = searchParams;
    const [tagList, setTagList] = useState<any[]>(tags)
    const router = useRouter();
    const handleClicked = (tag: any, value: any) => {
        tag.checked = value;
        const seletedTags = tagList.filter(s => s.checked === true).map(s => s.id);
        const seletedTagsId = seletedTags.join(',')
        if (searchText) {
            router.push(`/?searchText=${searchText}&selectedTagList=${seletedTagsId}`);
        } else if (category) {
            router.push(`/?category=${category}&selectedTagList=${seletedTagsId}`);
        } else if (myhome) {
            router.push(`/?myhome=${myhome}&selectedTagList=${seletedTagsId}`);
        } else {
            router.push(`/?selectedTagList=${seletedTagsId}`);
        }
        //scroll left or right
    }
    return (<>
        <div className='d-flex  mt-2'>
            <div className='me-2'>태그:</div>
            {tagList.length > 0 ? tagList.map((tag, index) => (
                <div key={tag.id} className="form-check mx-2" >
                    <input className="form-check-input" type="checkbox" value={tag.checked} id={tag.id} title={tag.name} onChange={(e) => handleClicked(tag, e.target.checked)} />
                    <label className="form-check-label ms-0" title={tag.name}>
                        {tag.name},
                    </label>
                </div>
            )) : (<>{ }</>)}
        </div>
    </>)
}
export default TagList; 
