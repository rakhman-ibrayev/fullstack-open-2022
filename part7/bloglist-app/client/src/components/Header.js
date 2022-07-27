import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../reducers/userReducer'
import {
    AppBar,
    Button,
    Toolbar,
    Box
} from '@mui/material'

const Header = ({ user }) => {
    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logout())
    }

    return (
        <header>
            <AppBar position="static">
                <Toolbar className="nav">
                    <Button color="inherit" component={Link} to="/">
                        blogs
                    </Button>
                    <Button color="inherit" component={Link} to="/users">
                        users
                    </Button>
                    <Box className="loggedin">{user.name} logged in</Box>
                    <Button color="inherit" onClick={handleLogout}>logout</Button>
                </Toolbar>
            </AppBar>
        </header>
    )
}

export default Header