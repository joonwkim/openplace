import React from "react";
import { deleteBulletinBoard } from "@/app/services/bulletinBoardService";
type DeleteBulletinBoardButtonProps = {
  bulletinBoardId: string;
  onDeleteSuccess: () => void;
};
const DeleteBulletinBoardButton = (props: DeleteBulletinBoardButtonProps) => {
  const handleDeleteBulletinBoard = async () => {
    try {
      const success = await deleteBulletinBoard(props.bulletinBoardId);

      if (success) {
        props.onDeleteSuccess();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={handleDeleteBulletinBoard}>삭제</button>
  );
};

export default DeleteBulletinBoardButton;
