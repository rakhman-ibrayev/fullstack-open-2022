import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const User = () => {
    const { id } = useParams()
    const user = useSelector(state => {
        return state.users.find(user => user.id === id)
    })

    if (!user) {
        return null
    }

    return (
        <div>
            <h1>{user.name}</h1>
            <h3>added blogs</h3>
            <ul>
                {user.blogs.map(blog =>
                    <li key={blog.id}>
                        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                    </li>
                )}
            </ul>
        </div>
    )
}

export default User