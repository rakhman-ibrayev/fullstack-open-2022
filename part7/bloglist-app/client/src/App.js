import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux/es/exports'
import { initializeBlogs } from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'
import { Routes, Route } from 'react-router-dom'
import { Container } from '@mui/material'

import Header from './components/Header'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import User from './components/User'
import Users from './components/Users'
import userService from './services/user'

const App = () => {
    const dispatch = useDispatch()
    const notification = useSelector(state => state.notification)
    const user = useSelector(state => state.user)
    const blogFormRef = useRef('')

    useEffect(() => {
        dispatch(initializeBlogs())
    }, [])

    useEffect(() => {
        const userFromStorage = userService.getUser()
        if (userFromStorage) {
            dispatch(setUser(userFromStorage))
        }
    }, [])

    if (user === null) {
        return (
            <Container>
                <Notification notification={notification} />
                <LoginForm />
            </Container>
        )
    }

    return (
        <Container>
            <Header user={user} />
            <h2>blog app</h2>
            <Notification notification={notification} />
            <Routes>
                <Route path='/blogs/:id' element={<Blog />} />
                <Route path='/users/:id' element={<User />} />
                <Route path='/users' element={<Users />} />
                <Route path='/' element={
                    <div>
                        <Togglable buttonText='new blog' ref={blogFormRef}>
                            <BlogForm
                                togglableRef={blogFormRef}
                            />
                        </Togglable>
                        <BlogList />
                    </div>
                } />
            </Routes>
        </Container>
    )
}

export default App