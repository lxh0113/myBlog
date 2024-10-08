// import React from 'react'
import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/home/index";
import Login from "../pages/login";
import Register from "../pages/register";
import { lazy, Suspense } from "react";

const Blog = lazy(() => import("../pages/home/components/blog"));
const Edit = lazy(() => import("../pages/edit"));
const Article = lazy(() => import("../pages/article"));
const Profile = lazy(() => import("../pages/profile"));
const Search = lazy(() => import("../pages/search"));
const Content = lazy(() => import("../pages/content"));
const Meesgae = lazy(() => import("../pages/message"));

const Back = lazy(() => import("../pages/back"));
const BackImage = lazy(() => import("../pages/back/homeImage"));
const BackArticle = lazy(() => import("../pages/back/article"));
const BackComments = lazy(() => import("../pages/back/comments"));
const BackUser = lazy(() => import("../pages/back/user"));

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login></Login>,
  },
  {
    path: "/register",
    element: <Register></Register>,
  },
  {
    path: "edit",
    element: (
      <Suspense fallback={"加载中……"}>
        <Edit></Edit>
      </Suspense>
    ),
  },
  {
    path: "edit/:id",
    element: (
      <Suspense fallback={"加载中……"}>
        <Edit></Edit>
      </Suspense>
    ),
  },
  {
    path: "article/:id",
    element: (
      <Suspense fallback={"加载中……"}>
        <Article></Article>
      </Suspense>
    ),
  },
  {
    path: "search/:word",
    element: (
      <Suspense fallback={"加载中……"}>
        <Search></Search>
      </Suspense>
    ),
  },
  {
    path: "content",
    element: (
      <Suspense fallback={"加载中……"}>
        <Content></Content>
      </Suspense>
    ),
  },
  {
    path: "message/:key",
    element: (
      <Suspense fallback={"加载中……"}>
        <Meesgae></Meesgae>
      </Suspense>
    ),
  },
  {
    path: "profile",
    element: (
      <Suspense fallback={"加载中……"}>
        <Profile></Profile>
      </Suspense>
    ),
  },
  {
    path: "back",
    element: (
      <Suspense fallback={"加载中……"}>
        <Back></Back>
      </Suspense>
    ),
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={"加载中……"}>
            <BackImage></BackImage>
          </Suspense>
        ),
      },
      {
        path: "article",
        element: (
          <Suspense fallback={"加载中……"}>
            <BackArticle></BackArticle>
          </Suspense>
        ),
      },
      {
        path: "comments",
        element: (
          <Suspense fallback={"加载中……"}>
            <BackComments></BackComments>
          </Suspense>
        ),
      },
      {
        path: "user",
        element: (
          <Suspense fallback={"加载中……"}>
            <BackUser></BackUser>
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/",
    element: <Home></Home>,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={"加载中……"}>
            <Blog></Blog>
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
