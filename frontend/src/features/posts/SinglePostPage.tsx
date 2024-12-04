import PostAuthor from './PostAuthor'
import TimeAgo from './TimeAgo'
import ReactionBtns from './ReactionBtns'
import { selectPostById } from './postsSlice'
import { useSelector } from 'react-redux'
import { RootStateType } from '../../app/store'
import { Link, useParams } from 'react-router-dom'


const SinglePostPage = () => {
    const { postId } = useParams();

    const post = useSelector((state: RootStateType) => selectPostById(state, postId as string))

    if (!post) {
        return (
            <section>
                <h2>Post Not Found!</h2>
            </section>
        )
    };

  return (
    <article>
      <h3>{post.title}</h3>
      <p>{post.body.substring(0,100)}</p>
      <div className="">
        <Link to={`/post/edit/${post.id}`}>Edit Post</Link>
        <PostAuthor userId={post.userId}/>
        <TimeAgo timeStamp={post.date}/>
      </div>
      
      <ReactionBtns post={post}/>
    </article>
  )
}

export default SinglePostPage