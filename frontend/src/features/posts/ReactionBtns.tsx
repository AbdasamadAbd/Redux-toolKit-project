import { PostType, useAddReactionMutation } from "./postsSlice";

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

  const [ addReaction ] = useAddReactionMutation();

  const reactionBtns = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type="button"
        className=""
        onClick={() => {
          
          const newValue = post.reactions[name] + 1 ; // increament for this specific reaction
          addReaction({postId: post.id, reactions: {...post.reactions, [name]: newValue}})
          console.log({...post.reactions, [name]: newValue});
        }}
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