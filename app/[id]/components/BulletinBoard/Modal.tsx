"use client";
import { getBulletinBoards } from "@/app/services/bulletinBoardService";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { BulletinBoard } from "./types";
enum Mode {
  LIST = 0,
  READ,
  WRITE,
  EDIT,
}
type BulletinBoardListProps = {
  knowhowId: string;
};
const BulletinBoardList = (props: BulletinBoardListProps) => {
  const [bulletinBoards, setBulletinBoards] = useState<BulletinBoard[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = (await getBulletinBoards(
        props.knowhowId
      )) as BulletinBoard[];
      setBulletinBoards(data);
      console.log(data);
    };

    fetchData();
  }, [props.knowhowId]);

  return (
    <div>
      <ul>
        {/* {bulletinBoards?.map((board) => (
          <li key={board.id}>
            <p>제목: {board.title}</p>
            <p>내용: {board.message}</p>
          </li>
        ))} */}
      </ul>
    </div>
  );
};
type BoardModalProps = {
  show: boolean | undefined;
  knowhowId: any;
  closeModal: React.MouseEventHandler<HTMLButtonElement> | undefined;
  hide: any;
};
const BoardModal = (props: BoardModalProps) => {
  const [mode, setMode] = useState(Mode.LIST);

  return (
    <Modal
      show={props.show}
      onHide={props.hide}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>그룹게시판</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <button onClick={() => setMode(Mode.LIST)}>view</button>
        <button onClick={() => setMode(Mode.READ)}>read</button>
        <button onClick={() => setMode(Mode.WRITE)}>글 작성</button>
        <button onClick={() => setMode(Mode.EDIT)}>edit</button>

        {mode === Mode.LIST && (
          <BulletinBoardList knowhowId={props.knowhowId} />
        )}

        {mode === Mode.READ && <>읽기:</>}

        {mode === Mode.WRITE && <>글쓰기:</>}

        {mode === Mode.EDIT && <>글수정:</>}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={props.closeModal}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BoardModal;
