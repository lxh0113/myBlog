import { Article } from "../types";
import http from "../utils/http";

export const getArticleAPI = (id: number) => {
  return http({
    url: "/article/search/" + id,
    method: "GET",
  });
};

export const getArticlesByUserIdAPI = (userId: number) => {
  return http({
    url: "/article/" + userId,
    method: "GET",
  });
};

export const getDraftArticleAPI = (userId: number) => {
  return http({
    url: "/article/draft/" + userId,
    method: "GET",
  });
};

export const getAuditArticleAPI = (userId: number) => {
  return http({
    url: "/article/audit/" + userId,
    method: "GET",
  });
};

export const getArticleByIdAPI = (userId: number, id: number) => {
  return http({
    url: "/article/" + userId + "/" + id,
    method: "GET",
  });
};

export const saveArticleAPI = (data: Article) => {
  return http({
    url: "/article/save",
    method: "POST",
    data,
  });
};

export const publishArticleAPI = (data: Article) => {
  return http({
    url: "/article/publish",
    method: "POST",
    data,
  });
};

export const getArticleColumnIdAPI = (id: number) => {
  return http({
    url: "/article/byColumn/" + id,
    method: "GET",
  });
};

export const getRecommendArticlesAPI = (userId: number) => {
  return http({
    url: "/article/recommend/" + userId,
    method: "GET",
  });
};

export const getFollowArticlesAPI = (userId: number) => {
  return http({
    url: "/article/follow/" + userId,
    method: "GET",
  });
};

export const getNewArticlesAPI = (userId:number) => {
  return http({
    url: "/article/new/"+userId,
    method: "GET",
  });
};

export const getHotArticlesAPI = (userId: number) => {
  return http({
    url: "/article/hot/" + userId,
    method: "GET",
  });
};

export const searchArticleAPI=(searchInput:string,userId:number)=>{
  return http({
    url:"/article/searchInput",
    method:"GET",
    params:{
      searchInput,userId
    }
  })
}
