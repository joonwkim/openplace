// 'use client'
// import React, { forwardRef, useImperativeHandle, useRef, useState, } from 'react';
// import { RegiOtherDatails } from '@/app/regContents/components/regiOtherDetails';
// import { Stage, ChildDetail, ChildHeader, ChildData } from '@/app/lib/types';
// import { ChildHeaderPage } from './childHeaderPage';

// export type StageProjectProps = {
//     // stage: Stage,
//     setRegDataToSave: (data: any) => void,
// };

// export const ChildProject = forwardRef<any, StageProjectProps>(({ setRegDataToSave, }: StageProjectProps, ref) => {

//     const childHeaderRef = useRef<any>(null);
//     const childDetailsRef = useRef<any>(null)
//     const [childHeader, setChildHeader] = useState<ChildHeader>()
//     const [childDetail, setChildDetail] = useState<ChildDetail>()
//     const [projectStage, setProjectStage] = useState(0)

//     useImperativeHandle(
//         ref,
//         () => ({
//             handleSubmit() {
//                 const data: ChildData = {
//                     header: childHeader,
//                     detail: childDetail,
//                 }
//                 setRegDataToSave(data);
//                 // console.log('data in useImperativeHandle ChildProject: ', data)
//             }
//         }),
//     );

//     const getChildHeader = ({ childHeader, }: { childHeader: ChildHeader, }) => {
//         setChildHeader(childHeader)
//         console.log('childHeader:', childHeader)
//     };

//     const getChildDetails = (data: any) => {
//         const { ytData, imgFormData, pdfFormData, text } = data;

//         const detail: ChildDetail = {
//             ytData: ytData,
//             imgData: imgFormData,
//             pdfData: pdfFormData,
//             text: text,
//         }
//         console.log('detail:', detail)
//         setChildDetail(detail);
//         // setProjectStage(stage.stage)
//     };

//     const handleOnMouseLeave = () => {
//         childHeaderRef.current?.handleSubmit()
//         childDetailsRef.current?.handleSubmit()
//     }
//     return (
//         <>
//             <div onMouseMove={handleOnMouseLeave}>
//                 <ChildHeaderPage ref={childHeaderRef} setRegDataToSave={getChildHeader} />
//             </div>
//             <div onMouseLeave={handleOnMouseLeave}>
//                 <RegiOtherDatails ref={childDetailsRef} setRegDataToSave={getChildDetails} />
//             </div>
//         </>
//     )
// });

// ChildProject.displayName = "ChildProject"