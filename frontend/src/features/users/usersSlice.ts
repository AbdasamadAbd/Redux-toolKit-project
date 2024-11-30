import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { FetchErrorType, FetchStatusType } from "../posts/postsSlice";
import axios from "axios";

const POSTS_URL = 'https://jsonplaceholder.typicode.com/users';


export interface UserType {
    id: number;
    name: string;
}

type StateType = {
    users: UserType[],
    status: FetchStatusType;
    error: FetchErrorType
}


const initialState: StateType = {
    users: [],
    status: "idle",
    error: null
}


export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
    try {
        const responce = await axios.get(POSTS_URL);
        return responce.data 
        
    } catch (err) {
        const error = err as Error;
        return error.message;
    }
});



const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {

    },

    extraReducers(builder) {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.status = "loading"
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.users = action.payload
                // return action.payload // that means it will repalce the state completely if you use initialState with userType[] which is an ampty array, to avoid accidentally adding the users twice or somthings like that .
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.error.message
            })
    },
})

export const selectAllUsers = (state: any): UserType[] => state.users.users;
export const getUsersStatus = (state: any): StateType["status"] => state.users.status;
export const getUsersError = (state: any): StateType["error"] => state.users.error;

export default userSlice.reducer