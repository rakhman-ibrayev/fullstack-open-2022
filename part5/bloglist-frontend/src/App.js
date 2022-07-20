import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'

import blogService from './services/blogs'
import userService from './services/user'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState(null)
    const [message, setMessage] = useState({ text: null, type: '' })
    const blogFormRef = useRef('')

    useEffect(() => {
        blogService.getAll().then(blogs => {
            let blogsToSort = [...blogs]
            setBlogs(blogsToSort.sort((a, b) => b.likes - a.likes))
        })
    }, [])

    useEffect(() => {
        const userFromStorage = userService.getUser()
        if (userFromStorage) {
            setUser(userFromStorage)
        }
    }, [])

    const notify = ({ text, type }) => {
        setMessage({ text, type })
        setTimeout(() => {
            setMessage({ text: null, type: '' })
        }, 5000)
    }

    const login = (username, password) => {
        loginService.login({
            username, password
        }).then(user => {
            setUser(user)
            userService.setUser(user)
        }).catch(() => {
            notify({
                text: 'wrong username or password',
                type: 'error'
            })
        })
    }

    const logout = () => {
        userService.clearUser()
        setUser(null)
    }

    const addBlog = blogObject => {
        blogService
            .create(blogObject)
            .then(returnedBlog => {
                setBlogs(blogs.concat(returnedBlog))
                notify({
                    text: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
                    type: 'success'
                })
                blogFormRef.current.toggleVisibility()
            })
    }

    const updateBlog = (id, blogObject) => {
        blogService
            .update(id, blogObject)
            .then(returnedBlog => {
                setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
            })
    }

    const deleteBlog = id => {
        blogService
            .remove(id)
            .then(() => {
                setBlogs(blogs.filter(blog => blog.id !== id))
            })
    }

    const blogForm = () => (
        <Togglable buttonText='new blog' ref={blogFormRef}>
            <BlogForm
                createBlog={addBlog}
                setMessage={setMessage}
            />
        </Togglable>
    )

    if (user === null) {
        return (
            <div>
                <Notification text={message.text} type={message.type} />
                <LoginForm onLogin={login} />
            </div>
        )
    }

    return (
        <div>
            <h2>blogs</h2>

            <Notification text={message.text} type={message.type} />

            <p>
                {user.name} logged in
                <button onClick={logout}>logout</button>
            </p>

            {blogForm()}

            {blogs.map(blog =>
                <Blog
                    key={blog.id}
                    blog={blog}
                    user={user}
                    updateBlog={updateBlog}
                    deleteBlog={deleteBlog}
                />
            )}
        </div>
    )
}

export default App