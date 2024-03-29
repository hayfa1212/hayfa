import {combineReducers} from '@reduxjs/toolkit'
import {reducer as authReducer} from "../slice/auth"

const rootReducer=combineReducers({
    auth:authReducer
})

export default rootReducer