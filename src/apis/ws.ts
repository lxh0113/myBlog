import axios from "axios";

export const getWsUrlAPI = () => {
  return axios({
    url: "http://127.0.0.1:5000/chat",
    method: "GET",
  });
};
