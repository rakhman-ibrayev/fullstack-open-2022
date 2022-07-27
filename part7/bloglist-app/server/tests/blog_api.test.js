const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')
const Blog = require('../models/blog')

let token = null
let user = null

beforeAll(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const userFromDb = await new User({
        username: 'root',
        passwordHash
    }).save()

    const userForToken = {
        username: userFromDb.username,
        id: userFromDb._id
    }

    token = jwt.sign(userForToken, process.env.SECRET)
    user = userFromDb
})

// TESTING BLOGS
describe('when there is initally some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})

        const initialBlogsWithUsers = helper.initialBlogs.map(blog => {
            return {
                ...blog,
                user: user._id
            }
        })

        await Blog.insertMany(initialBlogsWithUsers)
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
            .set('Authorization', `bearer ${token}`)
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

    test('blog creation fails if token is not provided', async () => {
        const blogsBeforeCreation = await helper.blogsInDb()

        const newBlog = {
            title: "A blog that should not be added",
            author: "R.Kelly",
            url: "blogs/blog-not",
            likes: 0,
        }

        const result = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('invalid token')

        const blogsAfterCreation = await helper.blogsInDb()
        expect(blogsAfterCreation).toHaveLength(blogsBeforeCreation.length)
    })

    test('if likes property is missing it defaults to 0', async () => {
        const newBlog = {
            title: "TDD harms architecture",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html"
        }

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(newBlog)
        expect(response.body.likes).toBe(0)
    })

    test('respond with the status code 400 if title and url are missing', async () => {
        const newBlog = {
            author: "Author Author",
            likes: 32
        }

        const result = await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(newBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('contents are missing')
    })

    test('blogs can be deleted', async () => {
        const blogsBeforeDeletion = await helper.blogsInDb()
        const blogToDelete = blogsBeforeDeletion[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `bearer ${token}`)
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
})

// TESTING USERS
describe('when there is initally one user one user at db', () => {
    describe('creation fails with proper statuscode and message', () => {
        const passwordValidationHelper = async (newUser, message) => {
            const usersBeforeCreation = await helper.usersInDb()

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(result.body.error).toContain(message)

            const usersAfterCreation = await helper.usersInDb()
            expect(usersAfterCreation).toHaveLength(usersBeforeCreation.length)
        }

        test('if username or password is missing', async () => {
            const newUser = {
                name: 'Superuser',
                password: 'somePassword'
            }

            await passwordValidationHelper(newUser, 'username or password is missing')
        })

        test('if username or password are less than 3 characters long', async () => {
            const newUser = {
                username: 'newRoot',
                name: 'Superuser',
                password: 'pa'
            }

            await passwordValidationHelper(newUser, 'username and password must be at least 3 characters long')
        })

        test('if username already taken', async () => {
            const newUser = {
                username: 'root',
                name: 'Superuser',
                password: 'somePassword'
            }

            await passwordValidationHelper(newUser, 'username must be unique')
        })
    })
})

afterAll(() => {
    mongoose.connection.close()
})