'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import styles from '@/app/regContents/page.module.css';
import { getImgUrlByFilenameAction } from '@/app/actions/imageAction';

type RegProps = {
    imgFileNames: string[],
};
interface SecureUrl {
    filename: string,
    secureUrl: string,
}

export const DispImages = (props: RegProps) => {
    const { imgFileNames } = props;
    const [urls, setUrls] = useState<SecureUrl[]>([]);

    const getSecureUrl = async (filename: string) => {
        const url = await getImgUrlByFilenameAction('openplace', filename);
        const result = await Promise.resolve(url);
        return result;
    };
    // const getSecureUrls = () => {
    //     console.log('getSecureUrls');
    //     imgFileNames.forEach(async filename => {
    //         // const url = await getImgUrlByFilenameAction('openplace', filename);
    //         // const result = await Promise.resolve(url);
    //         getSecureUrl(filename).then((url: string) => {
    //             const nu: SecureUrl = {
    //                 filename: filename,
    //                 secureUrl: url,
    //             };
    //             setUrls(prev => [...prev, nu]);
    //         });
    //     });
    //     console.log('secureUrls', urls);
    //     return urls;
    // };

    return (<>
        {imgFileNames && imgFileNames.length > 0 && (<div>
            <h3 className='mt-3'>이미지</h3>
            <div className='row row-cols-1 row-cols-md-3 row-cols-sm-3 mt-0 gap-0'>
                {/* {getSecureUrls().map((secureUrl: SecureUrl, index: number) => (
                    <div key={index} className={styles.listItem}                    >
                        <div className={`card ${styles.fillImage}`}>
                            {secureUrl && (<Image alt={secureUrl.filename} src={secureUrl.secureUrl} quality={100} fill sizes="100vw" style={{ objectFit: 'contain', }} />)}

                        </div>
                    </div>
                ))} */}
            </div>
        </div>)}
    </>
    );
};
export default DispImages;