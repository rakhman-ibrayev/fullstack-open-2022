import { useState } from 'react'

const Blog = ({ blog, user, updateBlog, deleteBlog }) => {
    const [visible, setVisible] = useState(false)

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    const likeBlog = () => {
        const likedBlog = {
            user: blog.user.id,
            likes: blog.likes + 1,
            author: blog.author,
            title: blog.title,
            url: blog.url
        }

        updateBlog(blog.id, likedBlog)
    }

    const removeBlog = () => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
            deleteBlog(blog.id)
        }
    }

    return (
        <div className="blog" style={blogStyle}>
            <div>
                {blog.title} {blog.author}
                <button onClick={toggleVisibility}>
                    {visible ? 'hide' : 'view'}
                </button>
            </div>

            {visible ?
                <div className="togglable-content">
                    <ul>
                        <li>{blog.url}</li>
                        <li>
                            likes {blog.likes}
                            <button className="btn-like" onClick={likeBlog}>like</button>
                        </li>
                        <li>{blog.user.name}</li>
                    </ul>
                    {blog.user.username === user.username ?
                        <button onClick={removeBlog}>
                            remove
                        </button> :
                        null
                    }
                </div> :
                null
            }
        </div>
    )
}

export default Blog