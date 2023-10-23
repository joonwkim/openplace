'use client'
import React, { useCallback, useState } from 'react'
import { DropzoneOptions, useDropzone } from 'react-dropzone'
interface FileUploaderProps {
    onFileDrop?: (file: File) => void;
    className?: string;
    loaderMessage?: string;
    dropMessage?:String;
    options?: DropzoneOptions;
}
const FileUploader = (props: FileUploaderProps) => {
    const { onFileDrop, className,loaderMessage,dropMessage, options } = props;
    const onDrop = useCallback((files: File[]) => {
        // console.log('file drop: ', JSON.stringify(files,null,2))
        // alert('fileuploader on drop')

        if (onFileDrop) {
            // console.log('onFileDrop:' + files[0].size)
            onFileDrop(files[0]);
           
        }
    }, [onFileDrop])

    const { getRootProps, getInputProps, isDragActive } = useDropzone(options ? options : { accept: { '피디에프': ['.pdf'], '파워포인트': ['.pptx'], 'word': ['.docx']}, onDrop})

    return (
        <div className='p-2'  {...getRootProps()} >
            <input {...getInputProps()}  />
            { isDragActive ? (<p className='text-center  p-1 mb-0'>Drop the files here ...</p>) : loaderMessage ? <p className='text-center  p-1 mb-0'>{loaderMessage}</p> :<p className='text-center  p-1 mb-0'>{dropMessage}</p> }
        </div>
    )
}

export default FileUploader