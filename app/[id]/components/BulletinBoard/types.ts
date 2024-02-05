// modal
export type BoardListProps = {
  knowhowId: any;
};
// list
export type BulletinBoard = {
  id: string;
  title: string;
  message: string;
};
//update
export type UpdateBulletinBoardFormProps = {
  bulletinBoardId: string;
  initialTitle: string;
  initialMessage: string;
  onUpdateSuccess: (updatedBulletinBoard: any) => void;
};
//services
export type UpdateBulletinBoard = {
  title: string;
  message: string;
};
