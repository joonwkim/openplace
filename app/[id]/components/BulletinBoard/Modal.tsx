"use client";
import { getBulletinBoards } from "@/app/services/bulletinBoardService";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { BulletinBoard } from "./types";
import { Knowhow } from "@prisma/client";
import styled from "styled-components";

const PostListWrapper = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  margin: auto;
`;

const PostCard = styled.li`
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 10px;
  transition: box-shadow 0.3s ease-in-out;

  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const PostTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
`;

const PostMeta = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const PostDetailWrapper = styled.div`
  margin: auto;
`;
const PostDetailTitle = styled.h1`
  font-size: 2rem;
  color: #333;
`;

const PostDetailContent = styled.div`
  margin-top: 20px;
  font-size: 1rem;
  line-height: 1.6;
`;

const PostDetailMeta = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 20px;
`;

enum Mode {
  LIST = 0,
  READ,
  WRITE,
  EDIT,
}

type BulletinBoardListProps = {
  knowhow: Knowhow;
  // knowhowId: string;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // or false for 24-hour format
  }).format(date);
}

type BoardModalProps = {
  show: boolean | undefined;
  // knowhowId: any;
  knowhow: Knowhow;
  closeModal: React.MouseEventHandler<HTMLButtonElement> | undefined;
  hide: any;
};
const BoardModal = (props: BoardModalProps) => {
  const [mode, setMode] = useState(Mode.LIST);
  const [detail, setDetail] = useState(null);

  console.log(props.knowhow?.bulletinBoards);
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
        debug:
        <button onClick={() => setMode(Mode.WRITE)}>글 작성</button>
        <button onClick={() => setMode(Mode.EDIT)}>edit</button>
        <Button variant="secondary" onClick={() => setMode(Mode.LIST)}>
          목록
        </Button>
        {mode === Mode.LIST && (
          <PostListWrapper>
            {props.knowhow?.bulletinBoards?.map((board) => (
              <PostCard
                key={board.id}
                onClick={() => {
                  setDetail(board);
                  setMode(Mode.READ);
                }}
              >
                <PostTitle>{board.title}</PostTitle>
                <PostMeta>{board.userId}</PostMeta>{" "}
                <PostMeta>
                  {formatDate(new Date(board.updatedAt || board.createdAt))}
                </PostMeta>
                {/* <p>내용: {board.message}</p> */}
              </PostCard>
            ))}
          </PostListWrapper>
        )}
        {mode === Mode.READ && detail && (
          <PostDetailWrapper>
            <PostDetailTitle>{detail.title}</PostDetailTitle>
            <PostDetailMeta>{detail.userId}</PostDetailMeta>
            <PostDetailMeta>
              {formatDate(new Date(detail.updatedAt))}
            </PostDetailMeta>
            <PostDetailContent>{detail.message}</PostDetailContent>
          </PostDetailWrapper>
        )}
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
