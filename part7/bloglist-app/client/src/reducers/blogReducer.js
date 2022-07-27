import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        setBlogs(state, action) {
            return action.payload
        },
        appendBlog(state, action) {
            state.push(action.payload)
        },
        updateBlogs(state, action) {
            return state.map(blog => {
                return blog.id !== action.payload.id ? blog : action.payload
            })
        },
        deleteBlog(state, action) {
            return state.filter(blog => blog.id !== action.payload)
        }
    }
})

export const { setBlogs, appendBlog, updateBlogs, deleteBlog } = blogSlice.actions

export const initializeBlogs = () => {
    return async (dispatch) => {
        const blogs = await blogService.getAll()
        dispatch(setBlogs(blogs))
    }
}

export const createBlog = (blog) => {
    return async (dispatch) => {
        const newBlog = await blogService.create(blog)
        dispatch(appendBlog(newBlog))
    }
}

export const likeBlog = (id, blog) => {
    return async (dispatch) => {
        const updatedBlog = await blogService.update(id, blog)
        dispatch(updateBlogs(updatedBlog))
    }
}

export const deleteBlogByID = (id) => {
    return async (dispatch) => {
        await blogService.remove(id)
        dispatch(deleteBlog(id))
    }
}

export const leaveComment = (id, comment) => {
    return async (dispatch) => {
        const returnedBlog = await blogService.createComment(id, comment)
        dispatch(updateBlogs(returnedBlog))
    }
}

export default blogSlice.reducer