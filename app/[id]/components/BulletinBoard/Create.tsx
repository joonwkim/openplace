import React, { useState } from "react";
import { createBulletinBoard } from "@/app/services/bulletinBoardService";

type CreateBulletinBoardFormProps = {
  knowhowId: string;
  onBulletinBoardCreated: (newBulletinBoard: any) => void;
};
const CreateBulletinBoardForm = (props: CreateBulletinBoardFormProps) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleCreateBulletinBoard = async () => {
    try {
      const newBulletinBoard = await createBulletinBoard({
        title,
        message,
        knowhowId: props.knowhowId,
        userId: "userId",
      });
      props.onBulletinBoardCreated(newBulletinBoard);
      setTitle("");
      setMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <label>제목:</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label>메시지:</label>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={handleCreateBulletinBoard}>글추가</button>
    </div>
  );
};

export default CreateBulletinBoardForm;
