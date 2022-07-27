import { configureStore } from '@reduxjs/toolkit'
import blogReducer from './reducers/blogReducer'
import userReducer from './reducers/userReducer'
import usersReducer from './reducers/usersReducer'
import notificationReducer from './reducers/notificationReducer'

const store = configureStore({
    reducer: {
        blogs: blogReducer,
        user: userReducer,
        users: usersReducer,
        notification: notificationReducer
    }
})

export default store