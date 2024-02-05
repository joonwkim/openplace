// UpdateBulletinBoardForm.tsx
import React, { useState, useEffect } from "react";
import { updateBulletinBoard } from "@/app/services/bulletinBoardService";
import { UpdateBulletinBoardFormProps } from "./types";
import { any } from "zod";
const UpdateBulletinBoardForm = ({
  bulletinBoardId,
  initialTitle,
  initialMessage,
  onUpdateSuccess,
}:UpdateBulletinBoardFormProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [message, setMessage] = useState(initialMessage);

  const handleUpdateBulletinBoard = async () => {
    try {
      const updatedBulletinBoard = await updateBulletinBoard(bulletinBoardId, {
        title,
        message,
      });

      onUpdateSuccess(updatedBulletinBoard);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { }, [handleUpdateBulletinBoard]);

  return (
    <div>
      <label>Title:</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label>Message:</label>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={handleUpdateBulletinBoard}>Update Bulletin Board</button>
    </div>
  );
};

export default UpdateBulletinBoardForm;
