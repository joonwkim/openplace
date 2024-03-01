'use client'
import { BulletinBoard, Knowhow } from '@prisma/client';
import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import './styles.css'
import Bulletins from './bulletins';
import CreateBulletin from './createBulletin';
import { format } from 'path';
import { consoleLogFormData } from '@/app/lib/formdata';
import { createBulletinAction } from '@/app/actions/bulletinAction';
import { useSession } from "next-auth/react";
import BulletinDetail from './bulletinDetail';

enum BoardStatus {
    BULLETINS = 0,
    DETAIL,
    CREATE,
    EDIT,
}
type BoardModalProps = {
    show: boolean | undefined;
    // knowhowId: any;
    knowhow: Knowhow | any;
    closeModal: React.MouseEventHandler<HTMLButtonElement> | undefined;
    hide: any;
};

// async function getBulletinsByKnowhowId(knowhowId: string): Promise<any> {
//     const res = await fetch(`/api/bulletins/bulletinBoards/?knowhowId=${knowhowId}`)
//     return res.json();
// }

const BulletinBoardModal = ({ show, knowhow, closeModal, hide }: BoardModalProps) => {
    const { data: session } = useSession();
    const [boardStatus, setBoardStatus] = useState(BoardStatus.BULLETINS)
    const [bulletins, setBulletins] = useState<BulletinBoard[]>(knowhow.bulletinBoards ? knowhow.bulletinBoards : [])
    const [selectedBulletin, setSelectedBulletin] = useState<BulletinBoard>()

    // useEffect(() => {
    //     const fetch = async () => {
    //         const data = await getBulletinsByKnowhowId(knowhow.id);
    //         setBulletins(data);
    //     }
    //     fetch();
    // }, [knowhow.id])

    const handleOnWriteBtnClicked = () => {
        setBoardStatus(BoardStatus.CREATE)
    }

    const handleRegisterBtnClicked = (formData: FormData) => {
    }

    const createBulletin = async (formData: FormData) => {
        if (!session) {
            alert('로그인 하셔아 글을 게시할 수 있습니다.')
        } else {
            const title = formData.get('title') as string;
            const message = formData.get('message') as string;
            if (title && message) {
                await createBulletinAction(knowhow.id, session.user.id, title, message)
                setBoardStatus(BoardStatus.BULLETINS)
            }
        }

    }
    const handleClickOnBulletin = (bulletin: BulletinBoard) => {
        // console.log(bulletin)
        setSelectedBulletin(bulletin)
        setBoardStatus(BoardStatus.DETAIL)
    }
    return (
        <>

            <Modal show={show} onHide={hide} backdrop="static" keyboard={false} size='xl'        >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <div className='d-flex justify-content-center align-items-center'>
                            <div className='board-title'>그룹 게시판</div>
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {boardStatus === BoardStatus.BULLETINS ? (<>
                        <Bulletins knowhowId={knowhow.id} handleClickOnBulletin={handleClickOnBulletin} />
                    </>) : boardStatus === BoardStatus.CREATE ? (<>
                        <CreateBulletin initialTitle='' initialData='' createBulletinAction={createBulletin} knowhowId={knowhow.id} />
                    </>) : boardStatus === BoardStatus.DETAIL ? (<>
                        <BulletinDetail bulletin={selectedBulletin} user={session?.user} />
                    </>) : (<></>)}
                </Modal.Body>
                <Modal.Footer>
                    {boardStatus === BoardStatus.BULLETINS ? (<>  <Button variant="primary" onClick={handleOnWriteBtnClicked}>
                        글쓰기
                    </Button></>) : boardStatus === BoardStatus.CREATE ? (<>
                        <Button className='me-3 mb-3' variant="primary" form='createBulletinForm' type='submit'>
                            저 장
                        </Button>
                        <Button className='me-3 mb-3' variant="secondary" onClick={() => setBoardStatus(BoardStatus.BULLETINS)}>
                            취 소
                        </Button>
                    </>) : boardStatus === BoardStatus.DETAIL ? (<>  <Button variant="secondary" onClick={() => setBoardStatus(BoardStatus.BULLETINS)} >
                        목록으로
                    </Button></>) : (<></>)}

                </Modal.Footer>
            </Modal>
        </>

    );
}

export default BulletinBoardModal