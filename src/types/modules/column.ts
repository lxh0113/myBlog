import { Article } from "./article";
import { User } from "./user";

type Column = {
  id: number | null;
  name: string | null;
  userId: number | null;
};

type SearchColumn={
  user:User|null;
  column:Column|null;
  articles:Article[]|null
}

export type {
    Column,
    SearchColumn
}
