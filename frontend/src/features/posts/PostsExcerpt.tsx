import PostAuthor from './PostAuthor'
import TimeAgo from './TimeAgo'
import ReactionBtns from './ReactionBtns'
import { PostType } from './postsSlice'

type Props = {
    post: PostType
}
const PostsExcerpt = ({ post }: Props) => {
  return (
    <article className='bg-gray-400 rounded-lg'>
      <h3>{post.title}</h3>
      <p>{post.body.substring(0,100)}</p>
      <div className="">
        <PostAuthor userId={post.userId}/>
        <TimeAgo timeStamp={post.date}/>
      </div>
      
      <ReactionBtns post={post}/>
    </article>
  )
}

export default PostsExcerpt