import { useDispatch } from "react-redux"
import { PostType, reactionAdded } from "./postsSlice";

import { FaHeart } from "react-icons/fa6";
import { FaCoffee, FaGrinHearts, FaRocket } from "react-icons/fa";
import { FaRegThumbsUp } from "react-icons/fa";


const reactionEmoji = {
    thumbsUp: <FaRegThumbsUp/>,
    wow: <FaGrinHearts/>,
    heart: <FaHeart/>,
    rocket: <FaRocket/>,
    coffee: <FaCoffee/>,
} 


const ReactionBtns = ({post}: {post: PostType}) => {
  const dispatch = useDispatch();

  const reactionBtns = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type="button"
        className=""
        onClick={() => dispatch(reactionAdded({postId: post.id, reaction: name}))}
      >
        {emoji} {post.reactions[name]}
      </button>
    )
  })


  return (
    <div>{reactionBtns}</div>
  )
}

export default ReactionBtns