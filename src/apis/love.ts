import { Love } from "../types";
import http from "../utils/http";

export const addLoveAPI = (data: Love) => {
  return http({
    url: "/love",
    method: "POST",
    data,
  });
};

export const deleteLoveAPI = (userId: number, articleId: number) => {
  return http({
    url: "/love/" + userId + "/" + articleId,
    method: "DELETE",
  });
};
