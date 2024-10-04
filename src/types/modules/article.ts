import { Column } from "./column";
import { Label } from "./label";
import { User } from "./user";

type Article = {
  id: number | null;
  userId: number | null;
  date: Date | null;
  title: string | null;
  content: string | null;
  url: string | null;
  status: number | null;
  categoryId: number | null;
  columnId: number | null;
  kind: string | null;
  brief: string | null;
};

type ArticleInfo = {
  article: Article | null;
  browse: null | number;
  collect: number | null;
  love: number | null;
  comments: number | null;
  labels: Label[];
  column: Column;
  userIsCollect: boolean | null;
  userIsLove: boolean | null;
  userIsComment: boolean | null;
  userIsFollow: boolean | null;
  user: User;
};

export { type Article, type ArticleInfo };
