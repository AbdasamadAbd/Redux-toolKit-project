import { createSlice, createAsyncThunk, createSelector, createEntityAdapter, EntityState } from "@reduxjs/toolkit";
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

interface StateType  extends EntityState<PostType, number>   {
    // posts: PostType[], // we do not need this becouse we using entities object to get posts (Normalization for performance read more in PostsExpert.tsx)
    count: number
    status: FetchStatusType;
    error: FetchErrorType 
}


const postsAdapter = createEntityAdapter<PostType>({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})



const initialState: StateType = postsAdapter.getInitialState({
    // posts: [], we remove the empty array , beocuse our initial state will already even if we didn't put anything else in it , it will already retun that normalized object wher you have an array of item ids and then you have that entities obkect that will actually have all the items so that's there automatically .
    // and this is the extra state we're adding on top of that : 
    count: 0,
    status: 'idle',
    error: null
}) 


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

        // this is not required becouse we using API post
        // postAdded: {
        //     reducer(state, action: PayloadAction<PostType>) {
        //         state.posts.push(action.payload)
        //     },

        //     prepare(title: string, body: string, userId: number) {
        //         return {
        //             payload: {
        //                 id: Number(nanoid()),
        //                 title,
        //                 body,
        //                 date: (new Date()).toISOString(),
        //                 userId,
        //                 reactions: {
        //                     thumbsUp: 0,
        //                     wow: 0,
        //                     heart: 0,
        //                     rocket: 0,
        //                     coffee: 0,
        //                 }
        //             }
        //         }
        //     }
        // },

        reactionAdded(state, action) {
            const { postId, reaction } = action.payload;
            const existingPost = state.entities[postId]; // beocuse we using this as an object lookUp , so the entties is an object and then we're passing the id to look up that specific post.
            // const existingPost = state.posts.find(post => post.id === postId);
            
            if (existingPost) {
                existingPost.reactions[reaction]++
                // this normally mutating the state as we just increased that but becouse we're in createSlice , so this is handled by emmer.js 
                // so it let us write code like this , that would normally mutate the stae but undernreath the hood emmer is making sure we are not  mutate the state.
                // you can only do this when you are in the createSlice
            }
        },

        increaseCount(state) {
            state.count = state.count + 1
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

                postsAdapter.upsertMany(state, loadedPosts) // post adapter has its own crud methods 
                // state.posts = loadedPosts;
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


                postsAdapter.addOne(state, newPost)
                // state.posts.push(newPost)

            })

            .addCase(updatePost.fulfilled, (state, action) => {
                const updatedPost = action.payload;

                if (!updatedPost?.id) {
                    console.log("Update could not complete");
                    console.log("error : ",updatedPost); // if there is no post id, that means axios return a payload which considered fulfilled but may be it;s just an error
                    return
                }

                updatedPost.date = new Date().toISOString();
                
                postsAdapter.upsertOne(state, updatedPost)
                // const { id } = updatedPost;
                // const posts = state.posts.filter(post => post.id !== id);
                // state.posts = [...posts, updatedPost]
            })

            .addCase(deletePost.fulfilled, (state, action) => {
                const deletedPost = action.payload;

                if (!deletedPost?.id) {
                    console.log("delete could not complete");
                    console.log("error : ",deletedPost); // if there is no post id, that means axios return a payload which considered fulfilled but may be it;s just an error
                    return
                }

                const { id } = deletedPost;
                postsAdapter.removeOne(state, id)
                // const posts = state.posts.filter(post => post.id !== id);
                // state.posts = posts
            })
    }
})


// we have to replace some of the selectors becouse getSelectors is another method we-re going to call that automatically creates some selectors that we would need . 

// getSelectors craetes these selectors and we rename theme with aliases using destructuring
export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds,
    // pass in a selector that returns the posts slece of state
} = postsAdapter.getSelectors((state: any) => state.posts)

// export const selectAllPosts = (state: RootStateType): PostType[] => state.posts.posts;
export const getPostsStatus = (state: RootStateType): StateType["status"] => state.posts.status;
export const getPostsError = (state: RootStateType): StateType["error"] => state.posts.error;

export const getCount = (state: RootStateType) => state.posts.count;

// export const selectPostById = (state: RootStateType, postId: number): PostType => 
//     state.posts.posts.find(post => post.id === postId) as PostType;  // becouse it can not be undifine , each post has its id



// we use this memoize selector to have a good performance
export const selectPostByUser = createSelector(
    [selectAllPosts, ( _ , userId: number) => userId],
    (posts: PostType[], userId: number) => posts.filter(post => post.userId === userId)
);

// createSelector accepts one or more input functions and notice that are inside of the brackets like an array , that shoud be your first clue that these are dependecies, acrually the values returnd from these functions are the dependecies,
// those dependecies provide the input paramaters for the output function of our memoize selector.
// so if the selectAllPosts value changes or the anonymos func which take ( state , userId: number) => userId, we need just the userId but we must do this func becouse this is a input func.
// but if posts or the user id changes essentially that's the only time that we'll get somthing new from this selector that's the only time that it will rerun , so it's memoized 




export const { reactionAdded, increaseCount } = postsSlice.actions;

export default postsSlice.reducer;