import { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ onLogin }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = event => {
        event.preventDefault()
        onLogin(username, password)
    }

    return (
        <form className="login-form" onSubmit={handleLogin}>
            <h2>log in to application</h2>
            <div>
                username
                <input
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
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={
                        ({ target }) => setPassword(target.value)
                    }
                />
            </div>
            <button className="btn-login" type="submit">login</button>
        </form>
    )
}

LoginForm.propTypes = {
    onLogin: PropTypes.func.isRequired
}

export default LoginForm