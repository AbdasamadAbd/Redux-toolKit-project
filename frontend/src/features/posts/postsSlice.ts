import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiSlice } from "../api/apiClient";


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


const postsAdapter = createEntityAdapter<PostType>({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})



const initialState = postsAdapter.getInitialState() 

// we are using the RTK query , and we remove createAsyncThunk and axios 

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getPosts: builder.query({
            query: () => '/posts',
            transformResponse: (resData: PostType[]) => {
                let min = 1;
                const loadedPosts = resData.map(post => {
                    if (!post?.date) post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    if (!post?.reactions) post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0,
                    }
                    return post
                })
                
                // to normalized data
                return postsAdapter.setAll(initialState, loadedPosts)
            },
            providesTags: (result) => [
                {type: 'Post', id: "LIST"},
                ...(result?.ids?.map(id => ({ type: 'Post' as const, id })) ?? []) // this const is required to fix the ts error
            ]
            // we indentifying the list and any time that we invalidate one of these tags it will re-perform or re-auto-fetch essentially all the posts again.
            // so if we want to get the full list we can just invalidate the list id .
            // but we also providing an object for each separate individual post passing the id from the post,
            // so if any one of those post ids are invalidated  it will also refetch our list automatically.
            // and that's what provides tags does  .
            // The providesTags function generates tags for the list of posts and each individual post. This means that when you update an individual post, you can invalidate the list by using the "LIST" tag, which will trigger a refetch of all posts.
        }),

        getPostsByUserId: builder.query({
            query: id => `posts/?userId=${id}`,
            transformResponse: (resData: PostType[]) => {
                let min = 1;
                const loadedPosts = resData.map(post => {
                    if (!post?.date) post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    if (!post?.reactions) post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0,
                    }
                    return post
                })

                // to normalized data
                return postsAdapter.setAll(initialState, loadedPosts)
                // setAll does not overWrite the cache state ofthe request for the full list of posts becouse redux is subscribing to these different queries which we'll be able to see when if we use redux-dev-tools
                // becouse this will have a cache state for this specific query as well 

                // and with postsAdapter we normalized the state .
            },
            providesTags: (result) => [
                // {type: 'Post', id: "LIST"},
                ...(result?.ids?.map(id => ({ type: 'Post' as const, id })) ?? [])
            ]
            // so any one of those posts were invalidated in the future , it could now to invalidate this cache, and re-runthis query by auto-fetching
        }),

        addNewPost: builder.mutation({
            query: initialPost => ({
                url: '/posts',
                method: 'Post',
                body: {
                    ...initialPost,
                    userId: Number(initialPost.userId),
                    date: new Date().toISOString(),
                    reactions: {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0,
                    }
                }
            }),
            invalidatesTags: [
                { type: 'Post', id: "List"} // there is no individual post becouse this post is not exit yet, but it will be part of the List , so this shoud be invalidate the posts list cache
            ]
        }),

        updatePost: builder.mutation({
            query: initialPost => ({
                url: `/posts/${initialPost.id}`,
                method: 'PUT',
                body: {
                    ...initialPost,
                    date: new Date().toISOString()
                }
            }),
            invalidatesTags: (_, __, arg) => [
                { type: 'Post', id: arg.id} 
                // it will invalidate which ever post id was there.
                // instead of using result we use the argument , becouse arg is that initialPost so means we get its id just by usnig arg.id <==> initialPost.id
            ]
        }),

        deletePost: builder.mutation({
            query: ({id}) => ({
                url: `/posts/${id}`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (_, __, arg) => [
                { type: 'Post', id: arg.id} 
            ]
        }),

        // we do not want to reload our posts list every time we add a reaction.
        // so we'll do it differently and this is what is called  an optimistic update and that's what we're going to perform here  
        //  optimistic update means we update our cached data before the data is received at the api 
        addReaction: builder.mutation({
            query: ({postId, reactions}) => ({
                url: `/posts/${postId}`,
                method: 'PATCH',
                // In a real app, we'd probably need to base this on user Id somehow,
                // so that a user can't do the same reaction more than once ,
                // becouse with this current setup a user will be able to have a reaction more than once 
                body: { reactions }
            }),
            async onQueryStarted({postId, reactions}, {dispatch, queryFulfilled}) {
                // 'updateQueryData' requires the endpoint name and cache key arguments.
                // so it knows which piece of cache state to update .
                
                const patchResult = dispatch(
                    extendedApiSlice.util.updateQueryData('getPosts', {}, draft => {  // it does not work when using undinfine as an arg so i make it {}
                        // draft is a draft of our data, which has entities propery
                        //  the 'draft' is Immer-wrapped and can be "mutated" like in createSlice ; becouse Immerjs will handle it correctly for us .
                        const post = draft.entities[postId];
                        if (post) post.reactions = reactions; // this normaly will be a mutation but immerjs will handle that correctly .
                    
                    })
                );                

                try {
                    await queryFulfilled; // we wait for this promise to fulfiiled
                    
                } catch {
                    patchResult.undo(); // other wise we'll undo this patch if there is an error
                    // becouse this is an poptimistic update so what we're really doing inside of dispatch block is updating our cache, and that happeninig optimistically possibly before the data at the api has been updated .
                    // so the user will see the the change in the ui , means when we click on a reaction and it instantly updates and then you see the network request go to the api to go ahead and update data , so it will match what we already see in our Ui .
                    // but if the query fails for any reason then it will  undo what we have changed inside of our cache data as well .
                }
            },
            // we do not use invalidatesTags here becouse we do not want to refetch the posts list every time a reaction is updated .
            // we just updateing optimistically the cache already, and not have to do another request but we are going to update the data at the api as well.
        }),


    })  
})

export const {
    useGetPostsQuery,
    useGetPostsByUserIdQuery,

    useAddNewPostMutation,
    useUpdatePostMutation,
    useAddReactionMutation,
    useDeletePostMutation,
} = extendedApiSlice;


// returns just the query result object that we already have from the query, it does not issue the query 
// return the entier object not just tha data
export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select({}); // use {} or indifine to fix ts error becouse you do not provide the queryArg in the getPosts; example of queryArgs = { page: 1, limit: 10 }

// creates memoized selector :
const selectPostsData = createSelector(
    selectPostsResult,
    postsResult => postsResult.data // nermalized state obj whith ids & entites
)


// we have to replace some of the selectors becouse getSelectors is another method we-re going to call that automatically creates some selectors that we would need . 
// getSelectors craetes these selectors and we rename theme with aliases using destructuring
export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds,
    // pass in a selector that returns the posts slece of state
} = postsAdapter.getSelectors((state: any) => selectPostsData(state) ?? initialState)
