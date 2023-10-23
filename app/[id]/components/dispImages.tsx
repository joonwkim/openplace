'use client';
import Image from 'next/image';
import React, { forwardRef, useState, useLayoutEffect } from 'react';
import styles from '@/app/regContents/page.module.css';
import { getImgUrlByFilename } from '@/app/actions/cloudinary';

type RegProps = {
    imgFileNames: string[],
};

export const DispImages = forwardRef<CanHandleSubmit, RegProps>((props: RegProps, ref) => {
    const { imgFileNames } = props;
    const [secureUrls, setSecureUrls] = useState<string[]>([]);

    useLayoutEffect(() => {
        const fetchData = () => {
            if (imgFileNames) {
                imgFileNames.forEach(async s => {
                    const url = await getImgUrlByFilename('openplace', s);
                    if (url) {
                        setSecureUrls(prev => [...prev, url]);
                    }
                });
            }
        };
        fetchData();
    }, [imgFileNames]);

    return (<>
        {secureUrls && secureUrls.length > 0 && (<div>
            <h3 className='mt-3'>이미지</h3>
            <div className='row row-cols-1 row-cols-md-3 row-cols-sm-3 mt-0 gap-0'>
                {secureUrls?.map((secureUrl, index) => (
                    <div key={index} className={styles.listItem}                    >
                        <div className={`card ${styles.fillImage}`}>
                            {secureUrl && (<Image alt={secureUrl} src={secureUrl} quality={100} fill sizes="100vw" style={{ objectFit: 'contain', }} />)}

                        </div>
                    </div>
                ))}
            </div>
        </div>)}
    </>
    );
});
DispImages.displayName = "DispImages";
