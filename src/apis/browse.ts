import { Browse } from "../types";
import http from "../utils/http";

export const addBrowseAPI = (data: Browse) => {
  return http({
    url: "/browse",
    method: "POST",
    data,
  });
};

export const getHistoryAPI = (userId: number) => {
  return http({
    url: "/browse/history/" + userId,
    method: "GET",
  });
};
