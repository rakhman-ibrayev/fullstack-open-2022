import axios from 'axios'
import userService from './user'
const baseUrl = '/api/blogs'

const config = () => {
    return {
        headers: { Authorization: `bearer ${userService.getToken()}` }
    }
}

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = async (newBlog) => {
    const res = await axios.post(baseUrl, newBlog, config())
    return res.data
}

const createComment = async (blogId, comment) => {
    const res = await axios.post(`${baseUrl}/${blogId}/comments`, { comment })
    return res.data
}

const update = async (id, newBlog) => {
    const res = await axios.put(`${baseUrl}/${id}`, newBlog)
    return res.data
}

const remove = async (id) => {
    const res = await axios.delete(`${baseUrl}/${id}`, config())
    return res.data
}

export default { getAll, create, createComment, update, remove }