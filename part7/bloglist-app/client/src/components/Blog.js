import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { leaveComment, likeBlog } from '../reducers/blogReducer'
import { useState } from 'react'

const Blog = () => {
    const [newComment, setNewComment] = useState('')
    const { id } = useParams()
    const blog = useSelector(state => {
        return state.blogs.find(blog => blog.id === id)
    })
    const dispatch = useDispatch()

    if (!blog) {
        return null
    }

    const handleLike = () => {
        const likedBlog = {
            user: blog.user.id,
            likes: blog.likes + 1,
            author: blog.author,
            title: blog.title,
            url: blog.url
        }

        dispatch(likeBlog(id, likedBlog))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        dispatch(leaveComment(id, newComment))
        setNewComment('')
    }

    const handleChange = (event) => {
        setNewComment(event.target.value)
    }

    return (
        <div className="blog">
            <h1>{blog.title}</h1>

            <a href={`${blog.url}`}>{blog.url}</a>
            <p>
                {blog.likes} likes
                <button onClick={handleLike}>like</button>
            </p>
            <p>added by {blog.user.name}</p>

            <h3>comments</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={newComment}
                    onChange={handleChange}
                />
                <button type="submit">add comment</button>
            </form>
            {blog.comments.map(comment =>
                <li key={comment}>{comment}</li>
            )}
        </div>
    )
}

export default Blog