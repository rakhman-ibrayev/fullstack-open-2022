import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> calls the event handler with the right details when creating a new blog', async () => {
    const createBlogMockHandler = jest.fn()

    render(<BlogForm createBlog={createBlogMockHandler} />)

    const user = userEvent.setup()
    const inputTitle = screen.getByPlaceholderText('title')
    const inputAuthor = screen.getByPlaceholderText('author')
    const inputUrl = screen.getByPlaceholderText('url')
    const btnCreate = screen.getByText('create')

    await user.type(inputTitle, 'some title')
    await user.type(inputAuthor, 'some author')
    await user.type(inputUrl, 'some url')
    await user.click(btnCreate)

    expect(createBlogMockHandler.mock.calls).toHaveLength(1)
    expect(createBlogMockHandler.mock.calls[0][0]).toEqual({
        title: 'some title',
        author: 'some author',
        url: 'some url'
    })
})