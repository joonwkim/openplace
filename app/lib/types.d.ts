export type CanHandleSubmit = {
    handleSubmit: () => void;
};

export type Stage = {
    id?: string,
    stageTitle: string,
    stage: number,
    children: ChildStage[],
}
export type ChildStage = {
    id?: string,
    title: string,
    description?: string,
    thumbnailUrl?: string,
    authorId: string,
    thumbnailFormdata?: FormData,
    ChildDetail?: ChildDetail,
}

// export type ChildData = {
//     header?: ChildHeader,
//     detail?: ChildDetail,

// }
// export type ChildHeader = {
//     title: string,
//     description: string,
   
//     thumbnailUrl?: string,
//     // stage: number,
   
//     // levelInStage: number,
// }

export type ChildDetail = {
    ytData?: YouTubeData[],
    imgData?: FormData[],
    pdfData?: Formdata[],
    text?: string,
}

type KVPairs<T, K extends keyof T = keyof T> = K extends keyof T ? { key: K, val: T[K] } : never;



