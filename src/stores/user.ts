
import { create } from 'zustand'

import { User } from '../types'

const useUserStore = create((set) => ({
  user:{},
  setUserInof:(value:User)=>set({
    user:value
  })
}))

export default useUserStore