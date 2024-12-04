import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../features/users/usersSlice";
import { apiSlice } from "../features/api/apiClient";


export const store = configureStore({
    reducer: {
        // posts: postsReducer,
        [apiSlice.reducerPath]: apiSlice.reducer, // this will be dynamically named, but in our case, it is ==> api: apiSlice.reducer
        users: usersReducer
    },
    // becouse we use RTK query wuth the store there's some required middlwares
    middleware: getDefaultMiddleware => 
        getDefaultMiddleware().concat(apiSlice.middleware)

    // getDefaultMiddleware is alredy the default middlware with redux , and it returned an array,
    // so we use concat and also adding the apiSlice middleware, which manages cache lifetimes and expirations and it is required to use it when using rtk query and an apiSlice 
})


export type RootStateType = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;