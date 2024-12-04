import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom"
import { selectUserById } from "./usersSlice";
import { RootStateType } from "../../app/store";
import { useGetPostsByUserIdQuery } from "../posts/postsSlice";

const UserPage = () => {
    const { userId } = useParams();
    const user = useSelector((state: RootStateType) => selectUserById(state, Number(userId)));

    const {
      data: postsForUser,
      isLoading,
      isSuccess,
      isError,
      error
    } = useGetPostsByUserIdQuery(userId);


    let content;
    if (isLoading) {
      content = <p>Loading...</p>
    } else if (isSuccess) {
      const { ids, entities } = postsForUser;

      content = ids.map(id => (
        <li>
            <Link to={`/post/${id}`}>{entities[id].title}</Link>
        </li>
      ))
    } else if (isError) {
      content = <p>{error as string}</p>
    }


  return (
    <section>
        <h2>{user?.name}</h2>
        <ol>{content}</ol>
    </section>
  )
}

export default UserPage