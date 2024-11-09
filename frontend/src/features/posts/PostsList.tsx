
import { useSelector } from 'react-redux'
import { selectAllPosts } from './postsSlice'
import PostAuthor from './PostAuthor'
import TimeAgo from './TimeAgo'
import ReactionBtns from './ReactionBtns'

const PostsList = () => {
  // const posts: PostType[] = useSelector( (state: any) => state.posts)
  const posts = useSelector( selectAllPosts )  // we do this so if we change the staructure of our state we do not need to change it in every single compo, just in the postsSlice

  const orderedPosts = posts.slice().sort((a, b)=> b.date.toISOString().localeCompare(a.date.toISOString()))

  const renderedPosts = orderedPosts.map(post => (
    <article className='bg-gray-400 rounded-lg'>
      <h3>{post.title}</h3>
      <p>{post.content.substring(0,100)}</p>
      <div className="">
        <PostAuthor userId={post.userId}/>
        <TimeAgo timeStamp={post.date.toISOString()}/>
      </div>
      
      <ReactionBtns post={post}/>
    </article>
  ))


  return (
    <section className='bg-white p-5 rounded-lg space-y-5'>
      <h2>Posts</h2>
      {renderedPosts}
    </section>
  )
}

export default PostsList