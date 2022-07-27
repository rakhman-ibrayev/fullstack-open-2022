import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        setNotification(state, action) {
            return action.payload
        }
    }
})

export const { setNotification } = notificationSlice.actions

export const notify = (notification, timeout) => {
    return async (dispatch) => {
        dispatch(setNotification(notification))
        setTimeout(() => {
            dispatch(setNotification(null))
        }, timeout * 1000)
    }
}

export default notificationSlice.reducer