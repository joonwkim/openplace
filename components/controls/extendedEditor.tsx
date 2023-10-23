import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build';
import parser from 'html-react-parser';

const ExtendedEditor = () => {
    const [showEditor, setEditor] = useState(true);
    const [data, setData] = useState('');
    const setMinHeight = (editor: any) => {
        editor.ui.view.editable.element.style.minHeight = "400px";
    };
   
    return (<>
        {showEditor && (<CKEditor 
            editor={Editor}
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
                setEditor(false)
            }}
            onFocus={(event, editor) => {
                setMinHeight(editor);
                console.log('Focus.', editor);
            }}
        />)}

        {!showEditor && ( <div onClick={()=> setEditor(true)} >
            {data && (<p>{parser(data)}</p>)}
        </div>)}

       
    </>);

};

export default ExtendedEditor;