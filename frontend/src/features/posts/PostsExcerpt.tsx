import PostAuthor from './PostAuthor'
import TimeAgo from './TimeAgo'
import ReactionBtns from './ReactionBtns'
import { PostType } from './postsSlice'
import { Link } from 'react-router-dom'

type Props = {
    post: PostType
}
const PostsExcerpt = ({ post }: Props) => {
  return (
    <article className='bg-gray-400 rounded-lg'>
      <h2>{post.title}</h2>
      <p>{post.body.substring(0,75)}...</p>
      <div className="">
        <Link to={`post/${post.id}`}>View Post</Link>
        <PostAuthor userId={post.userId}/>
        <TimeAgo timeStamp={post.date}/>
      </div>
      
      <ReactionBtns post={post}/>
    </article>
  )
}

export default PostsExcerpt