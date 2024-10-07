import { User } from "../types";
import http from "../utils/http";

export const loginAPI = (id: number, password: string) => {
  return http({
    url: "/user/login",
    method: "POST",
    params: {
      id,
      password,
    },
  });
};

export const getCaptchaAPI = (email: string) => {
  return http({
    url: "/user/getCaptcha/" + email,
    method: "GET",
  });
};

export const registerAPI = (
  email: string,
  password: string,
  captcha: string
) => {
  return http({
    url: "/user/register",
    method: "POST",
    params: {
      email,
      password,
      captcha,
    },
  });
};

export const getUserInfoAPI = (userId: number) => {
  return http({
    url: "/user/" + userId,
    method: "GET",
  });
};

export const getUserDetailsAPI = (userId: number) => {
  return http({
    url: "/user/info/" + userId,
    method: "GET",
  });
};

export const changeUserInfoAPI = (user: User) => {
  return http({
    url: "/user/change",
    method: "POST",
    data: user,
  });
};

export const searchUserAPI = (searchInput: string, userId: number) => {
  return http({
    url: "/user/searchInput",
    method: "GET",
    params: {
      searchInput,
      userId,
    },
  });
};

export const adminGetUsersAPI = (userId: number, word: string) => {
  return http({
    url: "/user/admin",
    method: "GET",
    params: {
      userId,
      word,
    },
  });
};
