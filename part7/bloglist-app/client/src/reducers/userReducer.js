import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import userService from '../services/user'
import { notify } from './notificationReducer'

const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        setUser(state, action) {
            return action.payload
        }
    }
})

export const { setUser } = userSlice.actions

export const login = (username, password) => {
    return async (dispatch) => {
        try {
            const user = await loginService.login({
                username, password
            })

            dispatch(setUser(user))
            userService.setUser(user)
        } catch (error) {
            dispatch(notify({
                text: 'wrong username or password',
                type: 'error'
            }, 5))
        }
    }
}

export const logout = () => {
    return async (dispatch) => {
        userService.clearUser()
        dispatch(setUser(null))
    }
}

export default userSlice.reducer