import {createSlice,PayloadAction} from '@reduxjs/toolkit'

const initialState = {
    addedItems:{} as Record <number,number>,
}

const slice=createSlice({
    name:'courses',
    initialState:initialState,
    reducers:{ 
        handleauth(state,action:PayloadAction<{isLoggedIn:boolean}>){


 
     
     
        }}
})

export const reducer=slice.reducer
export default slice