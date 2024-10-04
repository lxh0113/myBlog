import { Article } from "./article";
import { User } from "./user";

type Browse = {
  id: number | null;
  userId: number | null;
  articleId: number | null;
};

type BrowseHistory = {
  browse: Browse;
  article: Article;
  user: User;
};

type BrowseGroup = {
  date: string;
  browseHistory: BrowseHistory[];
};

export type { Browse, BrowseHistory, BrowseGroup };
