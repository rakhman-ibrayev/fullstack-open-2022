import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { initializeUsers } from '../reducers/usersReducer'

const Users = () => {
    const users = useSelector(state => state.users)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(initializeUsers())
    }, [])

    return (
        <div>
            <h1>Users</h1>
            <table>
                <tbody>
                    <tr>
                        <td></td>
                        <td><em>blogs created</em></td>
                    </tr>
                    {users.map(user =>
                        <tr key={user.id}>
                            <td>
                                <Link to={`/users/${user.id}`}>{user.name}</Link>
                            </td>
                            <td>{user.blogs.length}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Users