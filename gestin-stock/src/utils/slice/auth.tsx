import {createSlice,PayloadAction} from '@reduxjs/toolkit'



interface DataState{
    isLoggedIn:boolean
  }
  
const initialState = {
    isLoggedIn:false,
}

const slice=createSlice({
    name:'auth',
    initialState:initialState,
    reducers:{ 
        handellogin(state,action:PayloadAction<{ isLoggedIn:boolean}>){
            state. isLoggedIn=action.payload. isLoggedIn
          }

        
       }
})
export const { handellogin }= slice.actions
export const reducer=slice.reducer
export default slice