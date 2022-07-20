import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        setNotification(state, action) {
            return action.payload
        },
        removeNotification() {
            return null
        }
    }
})

export const { setNotification, removeNotification } = notificationSlice.actions

export const createNotification = (notification, timeout) => {
    return async (dispatch) => {
        dispatch(setNotification(notification))
        
        setTimeout(() => {
            dispatch(removeNotification())
        }, timeout * 1000)
    }
}

export default notificationSlice.reducer