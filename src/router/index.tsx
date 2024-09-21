// import React from 'react'
import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/home/index";
import Login from "../pages/login";
import Register from "../pages/register";
import { lazy, Suspense } from "react";

const Blog=lazy(()=>import('../pages/home/components/blog'))
const Edit=lazy(()=>import("../pages/edit"))
const Article=lazy(()=>import("../pages/article"))

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login></Login>
  },
  {
    path:'/register',
    element:<Register></Register>
  },
  {
    path:'edit',
    element:(
      <Suspense fallback={'加载中……'}>
        <Edit></Edit>
      </Suspense>
    )
  },
  {
    path:'article/:id',
    element:(
      <Suspense fallback={'加载中……'}>
        <Article></Article>
      </Suspense>
    )
  },
  {
    path:'/',
    element:<Home></Home>,
    children:[
      {
        index:true,
        element:(
          <Suspense fallback={'加载中……'}>
            <Blog></Blog>
          </Suspense>
        )
      }
    ]
  }
]);

export default router
