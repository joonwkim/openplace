'use client'
import '@/app/globals.css';
import { StageContents } from '@/app/lib/types';

interface StageContextMenuProps {
    editStageContent: () => void,
    deleteStageContent: () => void,
}
const StageContextMenu = ({ editStageContent, deleteStageContent, }: StageContextMenuProps) => {
    return (
        <div className="border-primary stage-context-menu border border-light m-2 p-2 bg-light">
            <ul className='list-group list-group-flush' >
                <li className='list-group-item' onClick={editStageContent}>컨텐츠 수정</li>
                <li className='list-group-item' onClick={deleteStageContent}>컨텐츠 삭제</li>
            </ul>
        </div>
    )
}

export default StageContextMenu