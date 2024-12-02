import { Route, Routes } from 'react-router-dom'
import './App.css'
import AddPostForm from './features/posts/AddPostForm'
import PostsList from './features/posts/PostsList'
import SinglePostPage from './features/posts/SinglePostPage'
import Layout from './components/Layout'
import EditPostForm from './features/posts/EditPostForm'

function App() {

  return (
    <Routes>
      <Route path='/' Component={Layout} >
        <Route index Component={PostsList} />
        <Route path='post'>
          <Route index Component={AddPostForm} />
          <Route path=':postId' Component={SinglePostPage} />
          <Route path='edit/:postId' Component={EditPostForm} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
