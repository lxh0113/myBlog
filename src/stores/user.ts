
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware';


import { User } from '../types'

const useUserStore = create(persist(
  (set)=>({
    user:{},
    setUserInfo:(value:User)=>set({
      user:value
    }),
    clearUserInfo:()=>set({
      user:{}
    })
  }),
  {
    name:'user',
    storage:createJSONStorage(()=>localStorage)
  }
))

export default useUserStore