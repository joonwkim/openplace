'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import styles from '@/app/regContents/page.module.css';
import { getImgUrlByFilenameAction } from '@/app/actions/imageAction';
import { KnowhowDetailOnCloudinary } from '@prisma/client';

type RegProps = {
    secureUrls: string[],
};

export const DispImages = (props: RegProps) => {
    const { secureUrls, } = props;
    const getSecureUrl = async (filename: string) => {
        const url = await getImgUrlByFilenameAction('openplace', filename);
        const result = await Promise.resolve(url);
        return result;
    };

    return (<>
        <div>
            <h3 className='mt-3'>이미지</h3>
            <div className='row row-cols-1 row-cols-md-3 row-cols-sm-3 mt-0 gap-0'>
                {secureUrls.length > 0 && (
                    secureUrls.map((secureUrl: any, index: number) => (<>
                        <div key={index} className={styles.listItem}>
                            <div className={`card ${styles.fillImage}`}>
                                {secureUrl && (<Image alt={secureUrl} src={secureUrl} quality={100} fill sizes="100vw" style={{ objectFit: 'contain', }} />)}
                            </div>
                        </div>
                    </>))
                )}
            </div>
        </div>
    </>
    );
};
export default DispImages;