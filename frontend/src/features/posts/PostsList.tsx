
import { useSelector } from 'react-redux'
import { fetchPosts, getPostsError, getPostsStatus, selectAllPosts } from './postsSlice'
import { useEffect } from 'react'
import PostsExcerpt from './PostsExcerpt'
import { useAppDispatch } from '../../hooks/useAppDispatch'

const PostsList = () => {
  // const posts: PostType[] = useSelector( (state: any) => state.posts)
  const posts = useSelector( selectAllPosts )  // we do this so if we change the staructure of our state we do not need to change it in every single compo, just in the postsSlice
  const postsStatus = useSelector( getPostsStatus )
  const postsError = useSelector( getPostsError )

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (postsStatus === "idle") {
      dispatch(fetchPosts())
    }
 },[postsStatus, dispatch])


  let content;
  if (postsStatus === "loading") {
    content = <p>Loading...</p> ;
  } 
  
  else if (postsStatus === "succeeded") {
    const orderedPosts = posts.slice().sort((a, b)=> b.date.localeCompare(a.date));

    content = orderedPosts.map(post => (
      <PostsExcerpt key={post.id} post={post}/>
    ))
  }

  else if (postsStatus === "failed") {
    content = <p>{postsError}</p>
  }



  return (
    <section className='bg-white p-5 rounded-lg space-y-5'>
      <h2>Posts</h2>
      {content}
    </section>
  )
}

export default PostsList