import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import AddPostForm from './features/posts/AddPostForm'
import PostsList from './features/posts/PostsList'
import SinglePostPage from './features/posts/SinglePostPage'
import Layout from './components/Layout'
import EditPostForm from './features/posts/EditPostForm'
import UsersList from './features/users/UsersList'
import UserPage from './features/users/UserPage'

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

        <Route path='user'>
          <Route index Component={UsersList} />
          <Route path=':userId' Component={UserPage} />
          {/* <Route path='edit/:postId' Component={EditPostForm} /> */}
        </Route>

        {/* catch all - replace with 404 component if you want */}
        <Route path='*' element={<Navigate to='/' replace />}/>

      </Route>
    </Routes>
  )
}

export default App
