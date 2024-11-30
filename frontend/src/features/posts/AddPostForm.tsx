import { useState } from "react"
import { useSelector } from "react-redux"
import { addNewPost, FetchStatusType } from "./postsSlice"
import { selectAllUsers } from "../users/usersSlice"
import { useAppDispatch } from "../../hooks/useAppDispatch"


const AddPostForm = () => {

    const dispatch = useAppDispatch()
    const users = useSelector( selectAllUsers )


    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [userId, setUserId] = useState<number>(NaN)

    const [addReqStatus, setAddReqStatus] = useState<FetchStatusType>("idle")


    // const canSave = Boolean(title) && Boolean(content)  && Boolean(userId)
    const canSave = [title, content, userId].every(Boolean) && addReqStatus === "idle";
    const onSavePostClicked = () => {
        if (canSave) {
            try {
                setAddReqStatus("pending");
                dispatch( addNewPost({title, body: content, userId}) ).unwrap()
                // reduxToolKit adds an unwrap func to the returned promise and then that return retuens a new promise that either has the action payload or it throws an arror, if it is the rejected action, so that let's us use this tryCatch logic here 

                setTitle("");
                setContent("");
                setUserId(NaN);

            } catch (error) {
                console.error("Faild to save the post ", error);
            } finally {
                setAddReqStatus("idle")
            }
        }
    }


    const usersOptions = users?.length && users.map(user => (
        <option key={user.id} value={user.id}>{user.name}</option>
    ))

  return (
    <section className="bg-slate-300 p-5 mb-6">
        <h2>Add a New Post</h2>
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
        </form>
    </section>
  )
}

export default AddPostForm