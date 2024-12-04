import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom"
import { RootStateType } from "../../app/store";
import { selectPostById, useDeletePostMutation, useUpdatePostMutation } from "./postsSlice";
import { selectAllUsers } from "../users/usersSlice";
import { useEffect, useState } from "react";

const EditPostForm = () => {
    const {postId} = useParams();
    const navigate = useNavigate();

    const [ updatePost, { isLoading } ] = useUpdatePostMutation();
    const [ deletePost ] = useDeletePostMutation();


    const post = useSelector((state: RootStateType) => selectPostById(state, postId as string));
    console.log("edited post : ", post);
    
    const users = useSelector(selectAllUsers);

    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [userId, setUserId] = useState<number>(0);

    // i do this becouse when you reload the page it does not rest the data to the orginal
    useEffect(()=> {
        if (post && post.userId != 0) {
            setTitle(post.title);
            setContent(post.body);
            setUserId(post?.userId);
        }
    }, [post])
    
    if (!post) {
        return (
            <section>
                <h2>Post Not Found!</h2>
            </section>
        )
    };

    const canSave = [title, content, userId].every(Boolean) && !isLoading;
    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                await updatePost({ id: post.id, title, body: content, userId, reactions: post.reactions}).unwrap()

                setTitle("");
                setContent("");
                setUserId(NaN);

                navigate(`/post/${postId}`)

            } catch (error) {
                console.error("Faild to save the post ", error);
            }
        }
    }


    const onDeletePostClicked = async () => {
        if (canSave) {
            try {
                await deletePost({ id: post.id}).unwrap()

                setTitle("");
                setContent("");
                setUserId(NaN);

                navigate(`/`)

            } catch (error) {
                console.error("Faild to delete the post ", error);
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