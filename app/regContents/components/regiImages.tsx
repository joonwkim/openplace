'use client';
import Image from 'next/image';
import React, { useCallback, forwardRef, useState, useImperativeHandle, useRef } from 'react';
import styles from '@/app/regContents/page.module.css';
import { DropzoneOptions } from 'react-dropzone';
import ImgUploader from '@/components/controls/imgUploader';
import Alert from 'react-bootstrap/Alert';
import { getSignature, saveToDatabase } from '@/app/actions/cloudinary';
import { getFormdata } from '../lib/formData';

type RegProps = {
    showImg: boolean;
    setRegDataToSave: (data: any) => void;
};

export const RegiImages = forwardRef<CanHandleSubmit, RegProps>((props: RegProps, ref) => {
    const { showImg, setRegDataToSave, } = props;
    const foldername = 'openplace';
    const [files, setFiles] = useState<any[]>([]);
    const [imgFormdata, setImgFormData] = useState<any[]>([]);
    const dragItem = useRef<any>(null);
    const dragOverItem = useRef<any>(null);

    useImperativeHandle(
        ref,
        () => ({
            handleSubmit() {
                const imgFilenames: string[] = files.map(s => s.name);
                getFormData();
                setRegDataToSave({ imgFilenames, imgFormdata });
                // handlePost();
                // setRegDataToSave(files);
            }
        }),
    );

    const onDrop = useCallback((acceptedFiles: any[], fileRejections: any[]) => {
        // alert('onDrop:' + JSON.stringify(acceptedFiles,null,2))
        if (acceptedFiles.length === 1) {
            if (!files.some(s => s.name === acceptedFiles[0].name)) {
                setFiles(prev => [...prev, Object.assign(acceptedFiles[0], { preview: URL.createObjectURL(acceptedFiles[0]) })]);
            }
        }
        else {
            acceptedFiles.forEach(file => {
                // console.log('condition:', !files.some(s => s.name !== file.name));
                if (files.length === 0 || !files.some(s => s.name !== file.name)) {
                    setFiles(prev => [...prev, Object.assign(file, { preview: URL.createObjectURL(file) })]);
                }
            });
        }

    }, [files]);

    const options: DropzoneOptions = {
        accept: { 'image/*': [] }, onDrop
    };

    const getFormData = async () => {
        setImgFormData([]);
        files.forEach(async file => {
            const formData = await getFormdata(file, foldername);
            if (formData) {
                setImgFormData(prev => [...prev, formData]);
            }
        });
    };

    const handleSort = () => {
        let _files = [...files];
        const draggedItemContent = _files.splice(dragItem.current, 1)[0];
        _files.splice(dragOverItem.current, 0, draggedItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setFiles(_files);
    };
    const handleRemove = (indexToDelete: number) => {
        const cfs = files.filter((file, i) => i !== indexToDelete);
        setFiles(cfs);
    };

    return (<>
        {showImg && (<div className={`border border-primary ${styles.inputDropNoBg}`}>
            <ImgUploader loaderMessage='이미지를 끌어오거나 선택하세요 ' dropMessage='여기에 놓으세요...' options={options} showUploadIcon={false} />
        </div>)}

        <div className='row row-cols-1 row-cols-md-3 row-cols-sm-3 mt-0 gap-0'>
            {files && (
                files.map((file, index) => (
                    <div key={index} className={styles.listItem} draggable onDragStart={(e) => (dragItem.current = index)} onDragEnter={(e) => (dragOverItem.current = index)}
                        onDragEnd={handleSort} onDragOver={(e) => e.preventDefault()}                    >
                        <Alert variant="white" onClose={() => handleRemove(index)} dismissible>
                            <div className={`card ${styles.fillImage}`}>
                                <Image
                                    alt='test image'
                                    src={file.preview}
                                    quality={100}
                                    fill
                                    sizes="100vw"
                                    style={{
                                        objectFit: 'contain',
                                    }}
                                />
                            </div>
                        </Alert>
                    </div>
                ))
            )}
        </div>

    </>
    );
});

RegiImages.displayName = "RegiImages";
