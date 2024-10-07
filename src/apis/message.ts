import { Message } from "../types";
import http from "../utils/http";

export const getNewFansMessageAPI = (userId: number) => {
  return http({
    url: "/message/" + userId,
    method: "GET",
  });
};

export const getLikesMessageAPI = (userId: number) => {
  return http({
    url: "/message/like/" + userId,
    method: "GET",
  });
};

export const getCollectMessageAPI = (userId: number) => {
  return http({
    url: "/message/collect/" + userId,
    method: "GET",
  });
};

export const getCommentsMessageAPI = (userId: number) => {
  return http({
    url: "/message/comments/" + userId,
    method: "GET",
  });
};

export const getMessagesAPI = (userId: number) => {
  return http({
    url: "/message/myMessage/" + userId,
    method: "GET",
  });
};

export const sendMessageAPI = (data: Message) => {
  return http({
    url: "/message",
    method: "POST",
    data
  });
};
