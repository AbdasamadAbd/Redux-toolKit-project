import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom"
import { selectUserById } from "./usersSlice";
import { RootStateType } from "../../app/store";
import { selectPostByUser } from "../posts/postsSlice";

const UserPage = () => {
    const { userId } = useParams();
    const user = useSelector((state: RootStateType) => selectUserById(state, Number(userId)));


    const postsForUser = useSelector(state => selectPostByUser(state, Number(userId)));


    // const postsForUser = useSelector((state: RootStateType) => {
    //     const allPosts = selectAllPosts(state)
    //     return allPosts.filter(post => post.userId === Number(userId));
    // });

    // performance : when we click on count btn in the hader we see in the reactDev tool > profile ,when we record at the user/userId page that the usersList renedr each time when we click the btn .
    // prblem :
    // + filter return a new array every time , 
    // + useSelector will run every time an action is dispatch and so when we dispatch that increase count in the header then the use selector runs again , and it forces a component to re-render if a new refernce value is returned, and we are returning a new value every time with filter so that why we'are rendering the UserPage   
    // solution :
    // + we will fix all that by creating a memoized selector. which is selectPostByUser


    const postTitles = postsForUser.map(post => (
        <li>
            <Link to={`/post/${post.id}`}>{post.title}</Link>
        </li>
    ));

  return (
    <section>
        <h2>{user?.name}</h2>
        <ol>{postTitles}</ol>
    </section>
  )
}

export default UserPage