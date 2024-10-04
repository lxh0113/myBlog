import { Collection } from "../types";
import http from "../utils/http";

export const addCollectionAPI = (data: Collection) => {
  return http({
    url: "/collection",
    method: "POST",
    data,
  });
};

export const deleteCollectionAPI = (id: number) => {
  return http({
    url: "/collection/" + id,
    method: "DELETE",
  });
};

export const changeCollectionAPI = (data: Collection) => {
  return http({
    url: "/collection",
    method: "PUT",
    data,
  });
};

export const getCollectionByUserIdAPI = (userId: number) => {
  return http({
    url: "/collection/" + userId,
    method: "GET",
  });
};

export const getContentCollectionAPI = (userId: number) => {
  return http({
    url: "/collection/content/" + userId,
    method: "GET",
  });
};
