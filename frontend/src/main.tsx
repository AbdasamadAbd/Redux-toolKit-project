import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import { fetchUsers } from './features/users/usersSlice.ts'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { extendedApiSlice } from './features/posts/postsSlice.ts'

// we want to fetch users when the app starts
store.dispatch(fetchUsers())

// store.dispatch(fetchPosts()) // if you do not fetch them here when you relod the page in the post (edit view) page you will get no posts found 
store.dispatch(extendedApiSlice.endpoints.getPosts.initiate({}));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/*' Component={App}/>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
