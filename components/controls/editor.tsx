import { forwardRef, useImperativeHandle, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

type FileProps = {
    // showTextEditor: boolean;
    setRegDataToSave: (data: any) => void;
};
export const Editor = forwardRef<CanHandleSubmit, FileProps>((props: FileProps, ref) => {

    const [data, setData] = useState<string>("");
    const {setRegDataToSave } = props;
    // const { showTextEditor, setRegDataToSave } = props;
    // const [showEditor, setEditor] = useState(true);

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
        editor.ui.view.editable.element.style.minHeight = "400px";
      };

    return (<>
        <CKEditor 
            editor={ClassicEditor}
            data={data}
            onReady={editor => {
                setMinHeight(editor);
                // You can store the "editor" and use when it is needed.
                console.log('Editor is ready to use!', editor);
            }}
            onChange={(event, editor) => {
                setMinHeight(editor);
                const data = editor.getData();
                setData(data);
                console.log({ event, editor, data });
            }}
            onBlur={(event, editor) => {
                // setMinHeight(editor);
                console.log('Blur.', editor);
                // setEditor(false)
            }}
            onFocus={(event, editor) => {
                setMinHeight(editor);
                console.log('Focus.', editor);
            }}
        />
    
       
    </>);
})
Editor.displayName = "Editor"