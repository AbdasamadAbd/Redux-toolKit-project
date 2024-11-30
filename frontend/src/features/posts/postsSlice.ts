import { createSlice, PayloadAction, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { sub } from "date-fns";

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

export interface PostType {
    id: string;
    userId: number;
    title: string;
    body: string;
    date: string;
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

export type FetchStatusType = 'idle' | 'pending' | 'loading' | 'succeeded' | 'failed';
export type FetchErrorType = string | undefined | null ;

type StateType = {
    posts: PostType[],
    status: FetchStatusType;
    error: FetchErrorType 
}

const initialState: StateType = {
    posts: [],
    status: 'idle',
    error: null
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    try {
        const responce = await axios.get(POSTS_URL);
        return responce.data
    } catch (err) {
        const error = err as Error;
        return error.message;
    }
})


interface NewPostType {
    userId: number;
    title: string;
    body: string;
}

export const addNewPost = createAsyncThunk<PostType, NewPostType>('posts/addNewPost', async (initialPost) => {
    try {
        const responce = await axios.post(POSTS_URL, initialPost);
        return responce.data
    } catch (err) {
        const error = err as Error;
        return error.message;
    }
})

// The error you're encountering is due to TypeScript's handling of errors in a try-catch block. By default, TypeScript does not know the type of the error caught in the catch block, so it infers it as unknown. This is a safety feature to ensure that you handle errors appropriately.



const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        // postAdded(state, action) {
        //     state.push(action.payload)
        // }

        postAdded: {
            reducer(state, action: PayloadAction<PostType>) {
                state.posts.push(action.payload)
            },

            prepare(title: string, body: string, userId: number) {
                return {
                    payload: {
                        id: nanoid(),
                        title,
                        body,
                        date: (new Date()).toISOString(),
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
            const existingPost = state.posts.find(post => post.id === postId);
            
            if (existingPost) {
                existingPost.reactions[reaction]++
                // this normally mutating the state as we just increased that but becouse we're in createSlice , so this is handled by emmer.js 
                // so it let us write code like this , that would normally mutate the stae but undernreath the hood emmer is making sure we are not  mutate the state.
                // you can only do this when you are in the createSlice
            }
        }
    },

    // extraReducers , it handling somthing that did not get defined inside of the noraml reducers part of the slice  
    extraReducers( builder) {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = "succeeded";

                // adding date and reactions to data to fit our data staructure :
                let min = 1;
                const loadedPosts = action.payload.map((post: PostType) => {
                    post.date = sub(new Date(), {minutes: min++}).toISOString(),
                    post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0,
                    }

                    return post;
                })

                state.posts = state.posts.concat(loadedPosts)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                const newPost = action.payload;

                console.log("newPost : ",newPost);
                
                newPost.userId = Number(newPost.userId);
                newPost.date = new Date().toISOString();
                newPost.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0,
                };
                console.log("newPost : ",newPost);


                state.posts.push(newPost)
                console.log("state.posts : ",state.posts);

            })
    }
})

export const selectAllPosts = (state: any): PostType[] => state.posts.posts;
export const getPostsStatus = (state: any): StateType["status"] => state.posts.status;
export const getPostsError = (state: any): StateType["error"] => state.posts.error;
export const { postAdded, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;