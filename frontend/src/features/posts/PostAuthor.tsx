import { useSelector } from "react-redux"
import { selectAllUsers } from "../users/usersSlice"
interface Props {
    userId: string
}

const PostAuthor = ({userId}: Props) => {
    const users = useSelector(selectAllUsers)

    const author = users.find(user => user.id === userId)
  return (
    <span className="bg-white px-3">
        By 
        { author? author.name : "Unknown author" }
    </span>
  )
}

export default PostAuthor