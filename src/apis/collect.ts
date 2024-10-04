import { Collect } from "../types";
import http from "../utils/http";

export const addCollectAPI = (data: Collect) => {
  return http({
    url: "/collect",
    method: "POST",
    data,
  });
};

export const getArticleCollectAPI = (userId: number, articleId: number) => {
  return http({
    url: "/collect/article",
    method: "GET",
    params: {
      userId,
      articleId,
    },
  });
};

export const deleteCollectAPI = (userId: number, articleId: number) => {
  return http({
    url: "/collect/" + userId + "/" + articleId,
    method: "DELETE",
  });
};

export const changeCollectionOfArticleAPI = (data: Collect) => {
  return http({
    url: "/collect/article",
    method: "POST",
    data,
  });
};

export const getCollectByCollectionAPI = (id: number) => {
  return http({
    url: "/collect/collection/" + id,
    method: "GET",
  });
};
