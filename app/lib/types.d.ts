export type CanHandleSubmit = {
    handleSubmit: () => void;
};

export type Stage = {
    stageTitle: string,
    stage: number,
    // levelInStage: number,
    thumbnailUrl?: string,
    // StageProject?: StageProject,
    children: ChildStage[],
}

export type ChildStage = {
    // description?: string,
    thumbnailUrl?: string,
    StageProject?: StageProject,
}

export type StageProject = {
    StageProjectHeaderData?: StageProjectHeaderData,
    StageProjectDetailData?: StageProjectDetailData
}

export type StageProjectHeaderData = {
    stageTitle?: string,
    description: string,
    thumbnailFormdata: FormData,
    thumbnailUrl?: string,
    stage: number,
    authorId: string
    // levelInStage: number,
}

export type StageProjectDetailData = {
    ytData?: YouTubeData[],
    imgData?: FormData[],
    pdfData?: Formdata[],
    text?: string,
}

type KVPairs<T, K extends keyof T = keyof T> = K extends keyof T ? { key: K, val: T[K] } : never;



