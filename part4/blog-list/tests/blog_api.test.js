const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))

    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('blogs have id properties', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
        expect(blog.id).toBeDefined()
    })
})

test('blog can be added', async () => {
    const newBlog = {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const blogTitles = blogsAtEnd.map(b => b.title)
    expect(blogTitles).toContain(
        'TDD harms architecture'
    )
})

test('if likes property is missing it defaults to 0', async () => {
    const newBlog = {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html"
    }

    const response = await api.post('/api/blogs').send(newBlog)
    expect(response.body.likes).toBe(0)
})

test('respond with the status code 400 if title or url are missing', async () => {
    const newBlog = {
        author: "Author Author",
        likes: 32
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
})

test('blogs can be deleted', async () => {
    const blogsBeforeDeletion = await helper.blogsInDb()
    const blogToDelete = blogsBeforeDeletion[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const blogsAfterDeletion = await helper.blogsInDb()
    const blogTitles = blogsAfterDeletion.map(b => b.title)

    expect(blogsAfterDeletion).toHaveLength(blogsBeforeDeletion.length - 1)
    expect(blogTitles).not.toContain(blogToDelete.title)
})

test('blogs can be updated', async () => {
    const blogsBeforeUpdate = await helper.blogsInDb()
    const blogToUpdate = blogsBeforeUpdate[0]
    const updatedLikes = Math.random() * 1000

    const blog = {
        ...blogToUpdate,
        likes: updatedLikes
    }

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blog)

    const blogsAfterUpdate = await helper.blogsInDb()
    const updatedBlog = blogsAfterUpdate[0]

    expect(updatedBlog.likes).toBe(updatedLikes)
})

afterAll(() => {
    mongoose.connection.close()
})