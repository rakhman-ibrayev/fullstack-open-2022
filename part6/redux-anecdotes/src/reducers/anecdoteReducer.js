import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
    name: 'anecdotes',
    initialState: [],
    reducers: {
        appendAnecdote(state, action) {
            state.push(action.payload)
        },
        updateAnecdotes(state, action) {
            const updatedAnecdote = { ...action.payload }

            return state.map(anecdote => {
                return anecdote.id !== updatedAnecdote.id ? anecdote : updatedAnecdote
            })

        },
        setAnecdotes(state, action) {
            return action.payload
        }
    }
})

export const { appendAnecdote, updateAnecdotes, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
    return async (dispatch) => {
        const anecdotes = await anecdoteService.getAll()
        dispatch(setAnecdotes(anecdotes))
    }
}

export const createAnecdote = (content) => {
    return async (dispatch) => {
        const newAnecdote = await anecdoteService.createNew(content)
        dispatch(appendAnecdote(newAnecdote))
    }
}

export const voteAnecdote = (anecdote) => {
    return async (dispatch) => {
        const id = anecdote.id
        const votedAnecdote = {
            ...anecdote,
            votes: anecdote.votes + 1
        }

        const updatedAnecdote = await anecdoteService.update(id, votedAnecdote)
        dispatch(updateAnecdotes(updatedAnecdote))
    }
}

export default anecdoteSlice.reducer