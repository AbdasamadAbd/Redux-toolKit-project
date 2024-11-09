import { createSlice } from "@reduxjs/toolkit"


export interface UserType {
    id: string;
    name: string;
}

const initialState: UserType[] = [
    { id: "0", name: "Dude Lebowski" },
    { id: "1", name: "hosni Lebowski" },
    { id: "2", name: "foad Lebowski" },
]

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {

    }
})

export const selectAllUsers = (state: any): UserType[] => state.users;

export default userSlice.reducer