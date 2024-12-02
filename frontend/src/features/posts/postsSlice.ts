import { createSlice, PayloadAction, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { sub } from "date-fns";
import { RootStateType } from "../../app/store";

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

export interface PostType {
    id: number;
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


interface UpdatePostType {
    id: number;
    userId: number;
    title: string;
    body: string;
    reactions: PostReactionsType;
}


export const updatePost = createAsyncThunk<PostType, UpdatePostType>('posts/updatePost', async (initialPost) => {
    const { id } = initialPost;
    try {
        const responce = await axios.put(`${POSTS_URL}/${id}`, initialPost);
        return responce.data
    } catch (err) {
        // const error = err as Error;
        // return error.message; 
        // whe do this becouse this fake api can not update the post that is not exist (when you add a new post);
        return initialPost  // only for testing Redux
    }
})


interface deletePostType {
    id: number;
}

export const deletePost = createAsyncThunk<PostType, deletePostType>('posts/deletePost', async (initialPost) => {
    const { id } = initialPost;
    try {
        const responce = await axios.delete(`${POSTS_URL}/${id}`);
        // we do this logic becouse as expected if a post is deleted the api will return the post id , but the fake api we using is not return it so we make that : 
        if (responce?.status === 200) return initialPost as any;
        return `${responce?.status}: ${responce?.statusText}`;
    } catch (err) {
        const error = err as Error;
        return error.message;
    }
})

// if you use the same type name you will get this error :
// Uncaught Error: `builder.addCase` cannot be called with two reducers for the same action type 'posts/updatePost/fulfilled'

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
                        id: Number(nanoid()),
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

                state.posts = loadedPosts;
                // state.posts = state.posts.concat(loadedPosts); // this will duplcate the posts and make problems when update 
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

            .addCase(updatePost.fulfilled, (state, action) => {
                const updatedPost = action.payload;

                if (!updatedPost?.id) {
                    console.log("Update could not complete");
                    console.log("error : ",updatedPost); // if there is no post id, that means axios return a payload which considered fulfilled but may be it;s just an error
                    return
                }

                const { id } = updatedPost;
                updatedPost.date = new Date().toISOString();
                const posts = state.posts.filter(post => post.id !== id);
                state.posts = [...posts, updatedPost]
            })

            .addCase(deletePost.fulfilled, (state, action) => {
                const deletedPost = action.payload;

                if (!deletedPost?.id) {
                    console.log("delete could not complete");
                    console.log("error : ",deletedPost); // if there is no post id, that means axios return a payload which considered fulfilled but may be it;s just an error
                    return
                }

                const { id } = deletedPost;
                const posts = state.posts.filter(post => post.id !== id);
                state.posts = posts
            })
    }
})

export const selectAllPosts = (state: RootStateType): PostType[] => state.posts.posts;
export const getPostsStatus = (state: RootStateType): StateType["status"] => state.posts.status;
export const getPostsError = (state: RootStateType): StateType["error"] => state.posts.error;

export const selectPostById = (state: RootStateType, postId: number): PostType => 
    state.posts.posts.find(post => post.id === postId) as PostType;  // becouse it can not be undifine , each post has its id

export const { postAdded, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;