'use client';

type FileProps = {
    pdfUrls: string[];
    // pdfFileNames: string[];
};

export const DispPdfFiles = (props: FileProps) => {

    const { pdfUrls, } = props;

    // const acceptedFileItems = pdfFileNames.map((file: any) => (
    //     <li className='list-group-item' key={file.path}>
    //         {/* {file.path} - {file.size} bytes */}
    //     </li>
    // ));
    return (
        <>
            {/* <h4>To be modified later</h4> */}
            {/* {pdfFileNames.length > 0 && (<>
                <h3 className='mt-3'>PDF 파일 </h3>
                {pdfFileNames && (JSON.stringify(pdfFileNames))}
            </>)}

            <aside>
                {acceptedFileItems.length > 0 && (
                    <>
                        <ul className="list-group mb-3" >{acceptedFileItems}</ul>
                    </>)}
            </aside> */}
        </>
    );
};




