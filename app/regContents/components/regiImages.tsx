'use client';
import Image from 'next/image';
import React, { useCallback, forwardRef, useState, useImperativeHandle, useRef } from 'react';
import styles from '@/app/regContents/page.module.css';
import { DropzoneOptions } from 'react-dropzone';
import ImgUploader from '@/components/controls/imgUploader';
import Alert from 'react-bootstrap/Alert';
import { getFormdata } from '../lib/formData';
import { CloudinaryData } from '@prisma/client';

type RegProps = {
    showImg: boolean;
    setRegDataToSave: (data: any) => void;
    imgCloudinaryData: CloudinaryData[],
    editMode: boolean | undefined,
};
export class CloudinaryFile extends File {
    filename: string | undefined | null;
    preview: string | undefined | null;
    cloudinaryDataId: string | undefined;
};

export const RegiImages = forwardRef<any, RegProps>((props: RegProps, ref) => {
    const { showImg, setRegDataToSave, imgCloudinaryData, editMode } = props;
    const foldername = 'openplace';

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
    //to control display on page
    const [files, setFiles] = useState<any[]>(getFiles());
    //to control on data savings
    const [filesAdded, setFilesAdded] = useState<any[]>([]);
    const [cloudinaryDataIdsToDelete, setCloudinaryDataIdsToDelete] = useState<string[]>([]);
    const [imgFormdata, setImgFormData] = useState<any[]>([]);

    const dragItem = useRef<any>(null);
    const dragOverItem = useRef<any>(null);

    useImperativeHandle(
        ref,
        () => ({
            handleSubmit() {
                const imgFilenames: string[] = files.map(s => s.name);
                if (editMode) {
                    getFormData(filesAdded);
                }
                else {
                    getFormData(files);
                }
                console.log(imgFormdata);
                setRegDataToSave({ imgFormdata, cloudinaryDataIdsToDelete });
            }
        }),
    );

    const onDrop = useCallback((acceptedFiles: any[], fileRejections: any[]) => {
        if (acceptedFiles.length === 1) {
            if (!files.some(s => s.name === acceptedFiles[0].name)) {
                setFiles(prev => [...prev, Object.assign(acceptedFiles[0], { preview: URL.createObjectURL(acceptedFiles[0]) })]);
                setFilesAdded(prev => [...prev, acceptedFiles[0]]);
            }
        }
        else {
            acceptedFiles.forEach(file => {
                if (files.length === 0 || !files.some(s => s.name !== file.name)) {
                    setFiles(prev => [...prev, Object.assign(file, { preview: URL.createObjectURL(file) })]);
                    setFilesAdded(prev => [...prev, acceptedFiles[0]]);
                }
            });
        }

    }, [files]);

    const options: DropzoneOptions = {
        accept: { 'image/*': [] }, onDrop
    };

    const getFormData = async (filesToAdd: any[]) => {
        setImgFormData([]);
        filesToAdd.forEach(async file => {
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
        if (editMode) {

        }
        const cfs = files.filter((file, i) => i !== indexToDelete);
        setFiles(cfs);
    };

    return (<>
        {showImg && (<div className={`border border-primary ${styles.inputDropNoBg}`}>
            <ImgUploader loaderMessage='이미지를 끌어오거나 선택하세요 ' dropMessage='여기에 놓으세요...' options={options} showUploadIcon={false} />
        </div>)}

        <div className='row row-cols-1 row-cols-md-3 row-cols-sm-3 mt-0 gap-0'>
            {files && files.length > 0 && (
                files.map((file, index) => (
                    <div key={index} className={styles.listItem} draggable onDragStart={(e) => (dragItem.current = index)} onDragEnter={(e) => (dragOverItem.current = index)}
                        onDragEnd={handleSort} onDragOver={(e) => e.preventDefault()}>
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
