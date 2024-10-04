import { Column } from "../types";
import http from "../utils/http";

export const getAllColumnsAPI = (userId: number) => {
  return http({
    url: "/column/" + userId,
    method: "GET",
  });
};

export const addColumnAPI = (data: Column) => {
  return http({
    url: "/column",
    method: "POST",
    data,
  });
};

export const changeColumnAPI = (data: Column) => {
  return http({
    url: "/column",
    method: "PUT",
    data,
  });
};

export const deleteColumnAPI = (id: number) => {
  return http({
    url: "/column/" + id,
    method: "DELETE",
  });
};

export const searchColumnAPI = (searchInput: string) => {
  return http({
    url: "/column/searchInput",
    method: "GET",
    params: {
      searchInput,
    },
  });
};
