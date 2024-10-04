import http from "../utils/http";

export const getMyFollowsAPI = (userId: number) => {
  return http({
    url: "/fans/follow/" + userId,
    method: "GET",
  });
};

export const getMyFansAPI = (userId: number) => {
  return http({
    url: "/fans/fans/" + userId,
    method: "GET",
  });
};

export const addFansAPI = (userId: number, fansId: number) => {
  return http({
    url: "/fans/" + userId + "/" + fansId,
    method: "POST",
  });
};

export const deleteFansAPI = (userId: number, fansId: number) => {
  return http({
    url: "/fans/" + userId + "/" + fansId,
    method: "DELETE",
  });
};
