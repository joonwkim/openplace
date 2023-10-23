'use client';
import React, { useCallback, useState } from 'react';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
interface FileUploaderProps {
    showUploadIcon: boolean;
    onFileDrop?: (file: File) => void;
    className?: string;
    loaderMessage?: string;
    dropMessage?: String;
    options?: DropzoneOptions;
}
const ImgUploader = (props: FileUploaderProps) => {
    const { showUploadIcon, onFileDrop, className, loaderMessage, dropMessage, options } = props;
    const onDrop = useCallback((files: File[]) => {
        if (onFileDrop) {
            console.log('onFileDrop:' + files[0].size);
            onFileDrop(files[0]);

        }
    }, [onFileDrop]);
    const { getRootProps, getInputProps, isDragActive } = useDropzone(options ? options : { accept: { 'image/*': [] }, maxSize: 1024 * 1000, maxFiles: 1, onDrop });
    return (<>
        <div className='p-2'  {...getRootProps()} >
            <input {...getInputProps()} />
            {showUploadIcon && (<>
                <p className='text-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-upload" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                        <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
                    </svg>
                </p>
            </>)}
            {isDragActive ? (<p className='text-center  p-1 mb-0'>{dropMessage}</p>) : loaderMessage ? <p className='text-center p-1 mb-0'>{loaderMessage}</p> : <p className='text-center  p-1 mb-0'>{dropMessage}</p>}
        </div>
    </>
    );
};

export default ImgUploader;