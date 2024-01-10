import React from 'react'
import RegisterationProjectStage from './components/registerationProjectStage';

const RagiProjectStagePage = async ({ searchParams }: { searchParams: { parentKnowhowId: string; editMode: boolean, isProjectType: boolean, stage: number, level: number }; }) => {

    const { parentKnowhowId, editMode, isProjectType, stage, level } = searchParams;
    console.log('searchParams:', JSON.stringify(searchParams, null, 2))
    return (
        <RegisterationProjectStage parentKnowhowId={parentKnowhowId} knowhow={null} editMode={editMode} projectType={isProjectType} stage={stage} level={level} />
    )
}
export default RagiProjectStagePage