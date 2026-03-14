import http from "../utils/http";

export const getCarouselAPI = () => {
  return http({
    url: "/carousel",
    method: "GET",
  });
};

export const changeCarouselAPI = (id: number, url: string) => {
  return http({
    url: "/carousel",
    method: "POST",
    data: {
      id,
      url,
    },
  });
};

export const addCarouselAPI = (url: string) => {
  return http({
    url: "/carousel",
    method: "PUT",
    params: {url},
  });
};

export const deleteCarouselAPI = (id: number) => {
  return http({
    url: "/carousel/" + id,
    method: "DELETE",
  });
};
