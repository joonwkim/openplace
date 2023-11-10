'use client';
import Image from 'next/image';
import styles from '@/app/regContents/page.module.css';
import { CloudinaryData } from '@prisma/client';
import { CloudinaryFile } from '@/app/regContents/components/regiImages';
import { useState } from 'react';

type RegProps = {
    imgCloudinaryData: CloudinaryData[],
};

export const DispImages = (props: RegProps) => {
    const { imgCloudinaryData, } = props;
    const getFiles = () => {
        let fs: CloudinaryFile[] = [];
        imgCloudinaryData?.forEach((s: any) => {
            let f = new CloudinaryFile([], '');
            f.preview = s.cloudinaryData?.secure_url;
            f.filename = s.cloudinaryData.filename;
            f.cloudinaryDataId = s.cloudinaryData.id;
            fs.push(f);
        });
        return fs;
    };
    const [files, setFiles] = useState<any[]>(getFiles());

    return (<>
        <div>
            <h3 className='mt-3'>이미지</h3>
            <div className='row row-cols-1 row-cols-md-3 row-cols-sm-3 mt-0 gap-0'>
                {files?.length > 0 && (
                    files.map((file: any, index: number) => (<>
                        <div key={index} className={styles.listItem}>
                            <div className={`card ${styles.fillImage}`}>
                                {file && (<Image alt={file.name} src={file.preview} quality={100} fill sizes="100vw" style={{ objectFit: 'contain', }} />)}
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