import { useState } from 'react'

const BlogForm = ({ createBlog, setMessage }) => {
    const [newBlog, setNewBlog] = useState({
        title: '', author: '', url: ''
    })

    const addBlog = event => {
        event.preventDefault()

        const blogObject = {
            title: newBlog.title,
            author: newBlog.author,
            url: newBlog.url
        }

        createBlog(blogObject)

        setMessage({
            text: `a new blog ${blogObject.title} by ${blogObject.author} added`,
            type: 'success'
        })
        setTimeout(() => {
            setMessage({ text: null, type: '' })
        }, 5000)

        setNewBlog({
            title: '', author: '', url: ''
        })
    }

    const handleBlogInput = event => {
        const { name, value } = event.target
        setNewBlog({ ...newBlog, [name]: value })
    }

    return (
        <form onSubmit={addBlog}>
            <h2>create new</h2>
            <div>
                title:
                <input
                    type="text"
                    name="title"
                    value={newBlog.title}
                    onChange={handleBlogInput}
                />
            </div>
            <div>
                author:
                <input
                    type="text"
                    name="author"
                    value={newBlog.author}
                    onChange={handleBlogInput}
                />
            </div>
            <div>
                url:
                <input
                    type="text"
                    name="url"
                    value={newBlog.url}
                    onChange={handleBlogInput}
                />
            </div>
            <button type="submit">create</button>
        </form>
    )
}

export default BlogForm