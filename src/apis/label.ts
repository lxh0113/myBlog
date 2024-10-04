import { Label } from "../types";
import http from "../utils/http";

export const getAllLabelsAPI = () => {
  return http({
    url: "/label",
    method: "GET",
  });
};

export const addNewLabelAPI = (data: Label) => {
  return http({
    url: "/label",
    method: "POST",
    data
  });
};

export const changeLabelAPI = (data: Label) => {
  return http({
    url: "/label",
    method: "PUT",
    data
  });
};

export const deleteLabelAPI = (id: number) => {
  return http({
    url: "/label/" + id,
    method: "DELETE",
  });
};
