import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../reducers/userReducer'
import { Button, TextField } from '@mui/material'

const LoginForm = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()

    const handleLogin = event => {
        event.preventDefault()
        dispatch(login(username, password))
    }

    return (
        <form className="login-form" onSubmit={handleLogin}>
            <h2>log in to application</h2>
            <div>
                username
                <TextField
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={
                        ({ target }) => setUsername(target.value)
                    }
                />
            </div>
            <div>
                password
                <TextField
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={
                        ({ target }) => setPassword(target.value)
                    }
                />
            </div>
            <Button variant="contained" color="primary" className="btn-login" type="submit">
                login
            </Button>
        </form>
    )
}

export default LoginForm