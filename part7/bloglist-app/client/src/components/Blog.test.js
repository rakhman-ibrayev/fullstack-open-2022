import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
    const blog = {
        likes: 1231,
        author: 'some author',
        title: 'a new blog',
        url: 'someurl/someurl',
        user: {
            username: 'some.username',
            name: 'some author'
        }
    }
    let container
    let updateMockHandler = jest.fn()

    beforeEach(() => {
        container = render(
            <Blog blog={blog} user={{ username: 'some.username', name: 'some author' }} updateBlog={updateMockHandler} />
        ).container
    })

    test('renders title and author by default but not url and number of likes', () => {
        const nonTogglableContent = screen.getByText(`${blog.title} ${blog.author}`)
        expect(nonTogglableContent).toBeDefined()
    })

    test('does not render url and likes at start', () => {
        const togglableContent = container.querySelector('.togglable-content')
        expect(togglableContent).toEqual(null)
    })

    test('url and number of likes are shown after view button is clicked', async () => {
        const user = userEvent.setup()
        const btnView = screen.getByText('view')
        await user.click(btnView)

        const togglableContent = container.querySelector('.togglable-content')
        expect(togglableContent).toBeDefined()
    })

    test('clicking like button twice calls the event handler twice', async () => {
        const user = userEvent.setup()
        const btnView = screen.getByText('view')
        await user.click(btnView)

        const btnLike = screen.getByText('like')
        await user.click(btnLike)
        await user.click(btnLike)

        expect(updateMockHandler.mock.calls).toHaveLength(2)
    })
})