'use client';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CanHandleSubmit } from "@/app/lib/types";

type FileProps = {
    // showTextEditor: boolean;
    setRegDataToSave: (data: any) => void;
    initialData: string,
    initHeight?: string,
};



export const Editor = forwardRef<CanHandleSubmit, FileProps>((props: FileProps, ref) => {
    const { setRegDataToSave, initialData } = props;
    const [data, setData] = useState(initialData);
    const [height, setHeight] = useState<string>(props.initHeight ? props.initHeight : '400px')

    useImperativeHandle(
        ref,
        () => ({
            handleSubmit() {
                // alert('handle submit of Test Editor: ')
                setRegDataToSave(data);
            }
        }),
    );
    const setMinHeight = (editor: any) => {
        editor.ui.view.editable.element.style.minHeight = height;
    };

    return (
        <>
            <CKEditor
                editor={ClassicEditor}
                data={data}
                onReady={(editor: any) => {
                    setMinHeight(editor);
                }}
                onChange={(event, editor: any) => {

                    const data = editor.getData();
                    setData(data);
                    setMinHeight(editor);
                    // console.log({ event, editor, data });
                }}
                onBlur={(event, editor) => {
                    editor.editing.view.change((writer: any) => writer.setStyle('height', height, editor.editing.view.document.getRoot()))
                    // console.log('Blur.', editor);
                }}
                onFocus={(event, editor) => {
                    setMinHeight(editor);
                    // console.log('Focus.', editor);
                }}

            />
        </>
    );

});
Editor.displayName = "Editor";