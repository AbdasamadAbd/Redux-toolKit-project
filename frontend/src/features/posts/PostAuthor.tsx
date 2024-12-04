import { useSelector } from "react-redux"
import { getUsersError, getUsersStatus, selectAllUsers } from "../users/usersSlice"
import { Link } from "react-router-dom"
interface Props {
    userId: number
}

const PostAuthor = ({userId}: Props) => {
    const users = useSelector(selectAllUsers)    
    const usersStatus = useSelector(getUsersStatus)
    const usersError = useSelector(getUsersError)

    let content;
    if (usersStatus === "loading") {
      content = <p>Loading...</p>
    }
    else if (usersStatus === "failed") {
      content = <p>{usersError}</p>
    }
    else if (usersStatus === "succeeded") {
      const author = users.find(user => user.id === userId)

      content = <span className="bg-white px-3">
                  By 
                  { author? <Link to={`/user/${userId}`}>{author.name}</Link> 
                    : "Unknown author" 
                  }
              </span>
    }

  return (
    content
  )
}

export default PostAuthor