import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'

const App = () => {
    // states for blogs and a user
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState(null)
    const [message, setMessage] = useState({ text: null, type: '' })
    const blogFormRef = useRef('')

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs(blogs.sort((a, b) => b.likes - a.likes))
        )
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBloglistappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const handleLogout = () => {
        window.localStorage.removeItem('loggedBloglistappUser')
        setUser(null)
    }

    const addBlog = (blogObject) => {
        blogFormRef.current.toggleVisibility()
        blogService
            .create(blogObject)
            .then(returnedBlog => {
                setBlogs(blogs.concat(returnedBlog))

                setMessage({
                    text: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
                    type: 'success'
                })
                setTimeout(() => {
                    setMessage({ text: null, type: '' })
                }, 5000)
            })
    }

    const updateBlog = (id, blogObject) => {
        blogService
            .update(id, blogObject)
            .then(returnedBlog => {
                setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
            })
    }

    const deleteBlog = (id) => {
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
            <LoginForm
                setUser={setUser}
            />
        )
    }

    return (
        <div>
            <h2>blogs</h2>

            <Notification text={message.text} type={message.type} />

            <p>
                {user.name} logged in
                <button onClick={handleLogout}>logout</button>
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