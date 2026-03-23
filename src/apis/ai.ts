import http from "../utils/http";

export const getRewriteTextAPI = (text: string) => {
  return http({
    url: "http://localhost:5000/text/rewrite",
    method: "POST",
    data: {
      text,
    },
  });
};

export const getTranslateTextAPI = (
  text: string,
  form?: string,
  to?: string,
) => {
  return http({
    url: "http://localhost:5000/text/translate",
    method: "POST",
    data: {
      text,form,to
    },
  });
};

export const getCorrectTextAPI = (text: string) => {
  return http({
    url: "http://localhost:5000/text/correction",
    method: "POST",
    data: {
      text,
    },
  });
};
