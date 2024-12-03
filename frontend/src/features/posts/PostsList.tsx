
import { useSelector } from 'react-redux'
import { getPostsError, getPostsStatus, selectPostIds } from './postsSlice'
import PostsExcerpt from './PostsExcerpt'

const PostsList = () => {
  // const posts: PostType[] = useSelector( (state: any) => state.posts)
  // const posts = useSelector( selectAllPosts )  // we do this so if we change the staructure of our state we do not need to change it in every single compo, just in the postsSlice
  const orderedPostsIds = useSelector( selectPostIds )
  const postsStatus = useSelector( getPostsStatus )
  const postsError = useSelector( getPostsError )

// we do not need that becouse we fetch post at the start of the app in main.tsx
//   useEffect(() => {
//     if (postsStatus === "idle") {
//       dispatch(fetchPosts())
//     }
//  },[postsStatus, dispatch])


  let content;
  if (postsStatus === "loading") {
    content = <p>Loading...</p> ;
  } 
  
  else if (postsStatus === "succeeded") {
    // const orderedPosts = posts.slice().sort((a, b)=> b.date.localeCompare(a.date));
    // content = orderedPosts.map(post => (
    //   <PostsExcerpt key={post.id} post={post}/>
    // ))

    content = orderedPostsIds.map(postId => (
      <PostsExcerpt key={postId} postId={postId} />
    ))
  }

  else if (postsStatus === "failed") {
    content = <p>{postsError}</p>
  }



  return (
    <section className='bg-white p-5 rounded-lg space-y-5'>
      {content}
    </section>
  )
}

export default PostsList