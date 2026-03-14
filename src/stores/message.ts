import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware';

const useMessageStore = create(persist(
  (set)=>({
    message:[],
    setMessage:(value:any)=>set({
      message:value
    }),
  }),
  {
    name:'message',
    storage:createJSONStorage(()=>localStorage)
  }
))

export default useMessageStore