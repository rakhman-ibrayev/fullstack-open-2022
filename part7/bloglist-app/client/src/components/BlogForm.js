import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { notify } from '../reducers/notificationReducer'

const BlogForm = ({ togglableRef }) => {
    const [newBlog, setNewBlog] = useState({
        title: '', author: '', url: ''
    })
    const dispatch = useDispatch()

    const handleSubmit = (event) => {
        event.preventDefault()

        const blogObject = {
            title: newBlog.title,
            author: newBlog.author,
            url: newBlog.url
        }

        dispatch(createBlog(blogObject))
        dispatch(notify({
            text: `a new blog ${blogObject.title} by ${blogObject.author} added`,
            type: 'success'
        }, 5))

        togglableRef.current.toggleVisibility()

        setNewBlog({
            title: '', author: '', url: ''
        })
    }

    const handleBlogInput = (event) => {
        const { name, value } = event.target
        setNewBlog({ ...newBlog, [name]: value })
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>create new</h2>
            <div>
                title:
                <input
                    type="text"
                    name="title"
                    id="title"
                    value={newBlog.title}
                    onChange={handleBlogInput}
                    placeholder="title"
                />
            </div>
            <div>
                author:
                <input
                    type="text"
                    name="author"
                    id="author"
                    value={newBlog.author}
                    onChange={handleBlogInput}
                    placeholder="author"
                />
            </div>
            <div>
                url:
                <input
                    type="text"
                    name="url"
                    id="url"
                    value={newBlog.url}
                    onChange={handleBlogInput}
                    placeholder="url"
                />
            </div>
            <button className="btn-create" type="submit">create</button>
        </form>
    )
}

export default BlogForm