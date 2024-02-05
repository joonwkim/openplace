import React, { useState, useEffect } from 'react';
import { getBulletinBoards, deleteBulletinBoard } from '@/app/services/bulletinBoardService'; 
import CreateBulletinBoardForm from './Create';
import { BulletinBoard } from './types';

type BulletinBoardListProps = {
  knowhowId: string;
};
const BulletinBoardList=(props:BulletinBoardListProps)=> {
  const [bulletinBoards, setBulletinBoards] = useState<BulletinBoard[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBulletinBoards(props.knowhowId);
        const boards = data as BulletinBoard[] ;
        setBulletinBoards(boards);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [props.knowhowId]);

  const handleBulletinBoardCreated = (newBulletinBoard: any) => {
    setBulletinBoards((prev) => (prev ? [...prev, newBulletinBoard] : [newBulletinBoard]));
  };

  const handleDeleteBulletinBoard = async (bulletinBoardId: string) => {
    try {
      const success = await deleteBulletinBoard(bulletinBoardId);
      if (success) {
        setBulletinBoards((prev) => (prev ? prev.filter((board) => board.id !== bulletinBoardId) : null));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <CreateBulletinBoardForm knowhowId={props.knowhowId} onBulletinBoardCreated={handleBulletinBoardCreated} />
      <ul>
        {bulletinBoards?.map((board) => (
          <li key={board.id}>
            <p>제목: {board.title}</p>
            <p>내용: {board.message}</p>
            <button onClick={() => handleDeleteBulletinBoard(board.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BulletinBoardList;
