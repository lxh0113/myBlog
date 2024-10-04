import { User } from "./user";

type Comment = {
  id: number | null;
  date: Date | string | null;
  articleId: number | null;
  content: string | null;
  userId: number | null;
  parentId: number | null;
  receiverId: number | null;
};

type CommentInfo={
    comment:Comment;
    user:User;
    receiverName:string;
    sonComments:CommentInfo[]|null;
}

export type { Comment,CommentInfo };
