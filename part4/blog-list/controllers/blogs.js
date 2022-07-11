const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog
        .find({}).populate('user', { username: 1, name: 1 })
    res.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (req, res) => {
    const body = req.body
    const user = req.user

    if (!body.title && !body.url) {
        return res.status(400).json({ error: 'contents are missing' })
    }

    const newBlog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
    })

    const savedBlog = await newBlog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (req, res) => {
    const user = req.user
    const blogToDelete = await Blog.findById(req.params.id)

    if (blogToDelete.user.toString() !== user.id.toString()) {
        return res.status(401).json({
            error: 'only blog authors can delete their blogs'
        })
    }

    await Blog.findByIdAndRemove(req.params.id)
    res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
    const blog = req.body

    const updatedBlog = await Blog.findByIdAndUpdate(
        req.params.id, blog, { new: true }
    )
    res.json(updatedBlog)
})

module.exports = blogsRouter