import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom"
import { RootStateType } from "../../app/store";
import { deletePost, FetchStatusType, selectPostById, updatePost } from "./postsSlice";
import { selectAllUsers } from "../users/usersSlice";
import { useState } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";

const EditPostForm = () => {
    const {postId} = useParams();
    const navigate = useNavigate();

    const post = useSelector((state: RootStateType) => selectPostById(state, Number(postId)));
    const users = useSelector(selectAllUsers);

    const [title, setTitle] = useState(post?.title);
    const [content, setContent] = useState(post?.body);
    const [userId, setUserId] = useState(post?.userId);
    const [requstStatus, setRequstStatus] = useState<FetchStatusType>("idle");

    const dispatch = useAppDispatch();
    
    if (!post) {
        return (
            <section>
                <h2>Post Not Found!</h2>
            </section>
        )
    };

    // const onTitleChanged = (e: any) => setTitle(e.target.value);
    // const onContentChanged = (e: any) => setContent(e.target.value);
    // const onAuthorChanged = (e: any) => setUserId(e.target.value);

    const canSave = [title, content, userId].every(Boolean) && requstStatus === "idle";
    const onSavePostClicked = () => {
        if (canSave) {
            try {
                setRequstStatus("pending");
                dispatch( updatePost({ id: post.id, title, body: content, userId, reactions: post.reactions}) ).unwrap()
                // reduxToolKit adds an unwrap func to the returned promise and then that return a new promise that either has the action payload or it throws an arror, if it is the rejected action, so that let's us use this tryCatch logic here 

                setTitle("");
                setContent("");
                setUserId(NaN);

                navigate(`/post/${postId}`)

            } catch (error) {
                console.error("Faild to save the post ", error);
            } finally {
                setRequstStatus("idle")
            }
        }
    }


    const onDeletePostClicked = () => {
        if (canSave) {
            try {
                setRequstStatus("pending");
                dispatch( deletePost({ id: post.id}) ).unwrap()

                setTitle("");
                setContent("");
                setUserId(NaN);

                navigate(`/`)

            } catch (error) {
                console.error("Faild to delete the post ", error);
            } finally {
                setRequstStatus("idle")
            }
        }
    }

    
    const usersOptions = users?.length && users.map(user => (
        <option key={user.id} value={user.id}>{user.name}</option>
    ))

  return (
    <section className="bg-slate-300 p-5 mb-6">
        <h2>Update Post</h2>
        <form className="mt-2">
            <label className="">
                Post Title
                <input type="text" 
                    className="w-full"
                    name="postTitle"
                    value={title}
                    onChange={(e)=> setTitle(e.target.value)}
                />
            </label>

            <label className="">
                Author :
                <select 
                    className="w-full"
                    name="userId"
                    value={userId}
                    onChange={(e)=> setUserId(Number(e.target.value))}
                >
                    <option value="" disabled>select author</option>
                    {usersOptions}
                </select>
            </label>

            <label>
                Content :
                <textarea
                    className="w-full"
                    rows={2} 
                    name="postContent"
                    value={content}
                    onChange={(e)=> setContent(e.target.value)}
                />
            </label>

            <button type="button" 
                onClick={onSavePostClicked}
                disabled={!canSave}
                className="bg-blue-400 px-3 disabled:bg-gray-400 rounded-lg"
            >
                Save Post
            </button>

            <button type="button" 
                onClick={onDeletePostClicked}
                disabled={!canSave}
                className="bg-blue-400 px-3 disabled:bg-gray-400 rounded-lg"
            >
                delete Post
            </button>
        </form>
    </section>
  )
}

export default EditPostForm