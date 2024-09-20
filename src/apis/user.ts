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
