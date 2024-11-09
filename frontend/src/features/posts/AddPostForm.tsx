import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { postAdded } from "./postsSlice"
import { selectAllUsers } from "../users/usersSlice"


const AddPostForm = () => {

    const dispatch = useDispatch()
    const users = useSelector( selectAllUsers )


    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [userId, setUserId] = useState("")

    const onSavePostClicked = () => {
        if (title && content) {
            dispatch(
                // postAdded({
                //     id: nanoid(),
                //     title,
                //     content
                // })

                postAdded(title,content,userId)

            )
        }
    }

    const canSave = Boolean(title) && Boolean(content)  && Boolean(userId)


    const usersOptions = users.map(user => (
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
                    onChange={(e)=> setUserId(e.target.value)}
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