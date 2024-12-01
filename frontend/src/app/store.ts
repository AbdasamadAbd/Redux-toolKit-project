import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "../features/posts/postsSlice";
import usersReducer from "../features/users/usersSlice";

// Define RootState type
// export type RootState = {
//     users: UserType[];
//     // other state slices
// };

export const store = configureStore({
    reducer: {
        posts: postsReducer,
        users: usersReducer
    }
})


export type RootStateType = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;