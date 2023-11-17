'use client';
import Image from 'next/image';
import styles from '@/app/regContents/page.module.css';
import { CloudinaryData } from '@prisma/client';
import { useState } from 'react';

type ImgProps = {
    initialImgs: CloudinaryData[],
};

export const DispImages = (props: ImgProps) => {
    const { initialImgs, } = props;
    const [imgs, setImgs] = useState<CloudinaryData[]>(initialImgs);


    return (<>
        <div>
            <h3 className='mt-3'>이미지</h3>
            <div className='row row-cols-1 row-cols-md-3 row-cols-sm-3 mt-0 gap-0'>
                {imgs?.length > 0 && (
                    imgs.map((img: any, index: number) => (<>
                        <div key={index} className={styles.listItem}>
                            <div className={`card ${styles.fillImage}`}>
                                {img && (<Image alt={img.path} src={img.secure_url} quality={100} fill sizes="100vw" style={{ objectFit: 'contain', }} />)}
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