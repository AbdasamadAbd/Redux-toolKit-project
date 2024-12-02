import { Outlet } from 'react-router-dom'
import Header from './Header'

const Layout = () => {
  return (
    <>
        <Header/>
        <main className=''>
            {/* Outlet represent all of childrens */}
            <Outlet/> 
        </main>
    </>
  )
}

export default Layout