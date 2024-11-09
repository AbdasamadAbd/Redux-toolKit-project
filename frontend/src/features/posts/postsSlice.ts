import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";
import { sub } from "date-fns";


export interface PostType {
    id: string;
    userId: string;
    title: string;
    content: string;
    date: Date;
    reactions: PostReactionsType;
}

interface PostReactionsType {
    [key: string]: number; // if you don't do this you will get an type error in ReactBtns compo
    thumbsUp: number,
    wow: number,
    heart: number,
    rocket: number,
    coffee: number,
}

const initialState: PostType[] = [
    { 
        id: "1", title: "Learning Redux Toolkit", content: "I've heard dhjh", userId:"6372", date: sub(new Date(), {minutes: 10}),
        reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
        }
    },

    { 
        id: "2", title: "Learning Redux ", content: "I've heard dhjh Toolkit dshdsgd dshfgdhgfdgsfj", userId:"02930", date: sub(new Date(), {minutes: 5}), 
        reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
        } 
    }
];

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        // postAdded(state, action) {
        //     state.push(action.payload)
        // }

        postAdded: {
            reducer(state, action: PayloadAction<PostType>) {
                state.push(action.payload)
            },

            prepare(title: string, content: string, userId: string) {
                return {
                    payload: {
                        id: nanoid(),
                        title,
                        content,
                        date: new Date(),
                        userId,
                        reactions: {
                            thumbsUp: 0,
                            wow: 0,
                            heart: 0,
                            rocket: 0,
                            coffee: 0,
                        }
                    }
                }
            }
        },

        reactionAdded(state, action) {
            const { postId, reaction } = action.payload;
            const existingPost = state.find(post => post.id === postId);
            
            if (existingPost) {
                existingPost.reactions[reaction]++
                // this normally mutating the state as we just increased that but becouse we're in createSlice , so this is handled by emmer.js 
                // so it let us write code like this , that would normally mutate the stae but undernreath the hood emmer is making sure we are not  mutate the state.
                // you can only do this when you are in the createSlice
            }
        }
    }
})

export const selectAllPosts = (state: any): PostType[] => state.posts;
export const { postAdded, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;