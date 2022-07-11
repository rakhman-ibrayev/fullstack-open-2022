import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'

const App = () => {
    // states for blogs and a user
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState(null)
    const [message, setMessage] = useState({ text: null, type: ''})

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs(blogs)
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

            <BlogForm
                blogs={blogs}
                setBlogs={setBlogs}
                setMessage={setMessage}
            />

            {blogs.map(blog =>
                <Blog key={blog.id} blog={blog} />
            )}
        </div>
    )
}

export default App