import http from "../utils/http";
import type { CooperateArticle } from "../types";

export const addCooperateArticleAPI = (userId: number) => {
  return http({
    url: "/cooperate/add/" + userId,
    method: "POST",
  });
};

export const saveCooperateArticleAPI = (cooperateArticle: CooperateArticle) => {
  return http({
    url: "/cooperate/save",
    method: "POST",
    data: cooperateArticle,
  });
};

export const deleteCooperateArticleAPI = (id: number) => {
  return http({
    url: "/cooperate/" + id,
    method: "DELETE",
  });
};

export const getHistoryCooperateArticleAPI = (
  userId: number,
  current: number,
  size: number,
) => {
  return http({
    url: "/cooperate/history",
    method: "GET",
    params: {
      userId,
      current,
      size,
    },
  });
};

export const getCooperateArticleAPI = (id: number) => {
  return http({
    url: "/cooperate/details/" + id,
    method: "GET",
  });
};
