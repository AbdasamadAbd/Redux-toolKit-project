
import { useSelector } from 'react-redux'
import { selectPostIds, useGetPostsQuery } from './postsSlice'
import PostsExcerpt from './PostsExcerpt'

const PostsList = () => {
  const {
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostsQuery(undefined);

  const orderedPostsIds = useSelector( selectPostIds )


  let content;
  if (isLoading) {
    content = <p>Loading...</p> ;
  } 
  
  else if (isSuccess) {
    content = orderedPostsIds.map(postId => (
      <PostsExcerpt key={postId} postId={postId} />
    ))
  }

  else if (isError) {
    content = <p>{error as string}</p>
  }



  return (
    <section className='bg-white p-5 rounded-lg space-y-5'>
      {content}
    </section>
  )
}

export default PostsList