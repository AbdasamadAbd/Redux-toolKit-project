import { useSelector } from "react-redux"
import { getUsersError, getUsersStatus, selectAllUsers } from "../users/usersSlice"
interface Props {
    userId: number
}

const PostAuthor = ({userId}: Props) => {
    const users = useSelector(selectAllUsers)    
    const usersStatus = useSelector(getUsersStatus)
    const usersError = useSelector(getUsersError)
    
    // we fetch users in the load time in main.ts to get theme dirctly when the app starts
    // useEffect(() => {
    //     if (usersStatus === "idle") {
    //       dispatch(fetchUsers())
    //     }
    // },[fetchUsers, dispatch])

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
                  { author? author.name : "Unknown author" }
              </span>
    }

  return (
    content
  )
}

export default PostAuthor