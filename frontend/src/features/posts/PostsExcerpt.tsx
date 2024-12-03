import PostAuthor from './PostAuthor'
import TimeAgo from './TimeAgo'
import ReactionBtns from './ReactionBtns'
import { selectPostById } from './postsSlice'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

type Props = {
  postId: number
  // post: PostType
}

const PostsExcerpt = ({ postId }: Props) => {
  const post = useSelector( state => selectPostById(state, postId));

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


// ================== performance : ===================

// we comment the memo becouse we will use state normalization and just using normalized data overall which is recommended in docs.
// => normalization : 
// + recommended approach for storing items
// + No duplication of data
// + Creates an Id lookUp : keeping the items stored in a lookup table by itemId.

// our normalized state shape is comprised of an object with an ids array and then a nested entities object that contains all of the items 
// {
//   posts: {
//     ids: [1,2,3,..],
//     entities: {
//       '1': { // postType
//         userId:1,
//         title: "shdjsh"
//       }
//     }
//   }
// }

// + the best part of using normalized data with redux toolkit is that reduxToolkit offers a createEntityAdapter API, and that will make your slice less complicated and easier to manage.
// => createEntityAdapter API :
// + Abstracts more logic from compnents .
// + Build-in CRUD methods 
// + Automatic selector generation



// to use memo make let PostsExcerpt not const PostsExcerpt above than :

// PostsExcerpt = memo(PostsExcerpt);

// that allows this component to not re-render , if the prop that it receives has not changed.
// so if the post does not change that's passed to post excerpt it will not re-render so this easily solves the immediate problem that we have , which is re-render all the postsExeceprt when we click on a reaction  
// now it we re-render just the PostsExcerpt that its reaction updated.

export default PostsExcerpt