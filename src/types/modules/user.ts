type User = {
  id?: number | null;
  username: string | null;
  password: string | null;
  age: number | null;
  avatar: string | null;
  gender: number | null;
  intro: string | null;
  email: string | null;
};

type UserInfo = {
  articles: null | number;
  love: number | null;
  follow: null | number;
  fans: null | number;
  isFollow: null | boolean;
};

type UserDetails = {
  user: User | null;
  userInfo: UserInfo | null;
};

export type { User, UserInfo, UserDetails };
