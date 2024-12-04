import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const apiSlice = createApi({
    reducerPath: 'api', // optional becouse this the default but if you name something else it is required to define it
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:3800'}),
    tagTypes: ['Post'],
    endpoints: (_) => ({}) // this is required, becouse we will inject endpoints from extend slices , what we need to do is create extended slices, so we can separate our logic from posts and users for our project 
})


// we have extended slices in postsSlice