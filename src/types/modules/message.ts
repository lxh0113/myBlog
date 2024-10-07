import { Article } from "./article";
import { User } from "./user";
import { Comment } from "./comment";

type Message = {
  id: number | null;
  senderId: number | null;
  receiverId: number | null;
  content: string | null;
  date: Date | string | null;
};

type MessageFriend = {
  messages: Message[];
  user:User
};

type MessageCommon = {
  user: User;
  kind: string;
  comment?: Comment;
  article: Article;
};

export type { Message, MessageFriend, MessageCommon };
