import { useState } from 'react'
import Notification from './Notification'
import loginService from '../services/login'
import blogService from '../services/blogs'

const LoginForm = ({ setUser }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState({ text: null, type: ''})

    const handleLogin = async event => {
        event.preventDefault()

        try {
            const user = await loginService.login({
                username, password,
            })

            window.localStorage.setItem(
                'loggedBloglistappUser', JSON.stringify(user)
            )
            blogService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
        } catch (exception) {
            setMessage({
                text: `wrong username or password`,
                type: 'error'
            })
            setTimeout(() => {
                setMessage({ text: null, type: '' })
            }, 5000)
        }
    }

    return (<form onSubmit={handleLogin}>
        <h2>log in to application</h2>
        <Notification text={message.text} type={message.type} />
        <div>
            username
            <input
                type="text"
                name="username"
                value={username}
                onChange={
                    ({ target }) => setUsername(target.value)
                }
            />
        </div>
        <div>
            password
            <input
                type="password"
                name="password"
                value={password}
                onChange={
                    ({ target }) => setPassword(target.value)
                }
            />
        </div>
        <button type="submit">login</button>
    </form>)
}

export default LoginForm