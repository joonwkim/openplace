export type CanHandleSubmit = {
    handleSubmit: () => void;
};

export type Stage = {
    stageTitle: string,
    stage: number,
    // levelInStage: number,
    // thumbnailUrl?: string,
    // StageProject?: StageProject,
    children: ChildStage[],
}

export type ChildStage = {
    // description?: string,
    title: string,
    description: string,
    thumbnailUrl?: string,
    authorId: string,
    thumbnailFormdata: FormData,
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



