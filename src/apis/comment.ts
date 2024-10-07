import http from "../utils/http";
import { type Comment } from "../types";

export const getCommentsAPI = (articleId: number) => {
  return http({
    url: "/comments/" + articleId,
    method: "GET",
  });
};

export const addCommentAPI = (data: Comment) => {
  return http({
    url: "/comments",
    method: "POST",
    data,
  });
};

export const deleteCommentAPI = (id: number) => {
  return http({
    url: "/comments/" + id,
    method: "DELETE",
  });
};

export const adminGetCommentsAPI = (articleId: number, word: string) => {
  return http({
    url: "/comments/admin",
    method: "GET",
    params: {
      articleId,
      word,
    },
  });
};
