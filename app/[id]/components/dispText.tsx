'use client';
import { useEffect, useState } from 'react';
import parser from 'html-react-parser';

type FileProps = {
    detailText: string;
};

export const DispText = (props: FileProps) => {
    const { detailText } = props;
    const [data, setData] = useState<string>("");
    useEffect(() => {
        setData(detailText);
    }, [detailText]);
    return (
        <>
            {data && (<>
                <h3 className='mt-3'>텍스트와 이미지</h3>
                <div className='border rounded border-info p-3'>{parser(data)}</div>
            </>)}
        </>
    );
};