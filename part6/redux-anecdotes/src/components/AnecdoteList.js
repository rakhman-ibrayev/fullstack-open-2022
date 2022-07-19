import { useDispatch, useSelector } from 'react-redux/es/exports'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { removeNotification, setNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleVote }) => {
    return (
        <div>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={handleVote}>vote</button>
            </div>
        </div>
    )
}

const AnecdoteList = () => {
    const anecdotes = useSelector(state => {
        return state.anecdotes.sort((a, b) => b.votes - a.votes)
    })
    const filter = useSelector(state => state.filter)
    const dispatch = useDispatch()

    return (
        <div>
            {anecdotes.map(anecdote =>
                anecdote.content.includes(filter) ?
                <Anecdote
                    key={anecdote.id}
                    anecdote={anecdote}
                    handleVote={() => {
                        dispatch(voteAnecdote(anecdote.id))
                        dispatch(setNotification(
                            `you voted '${anecdote.content}'`
                        ))
                        setTimeout(() => {
                            dispatch(removeNotification())
                        }, 5000)
                    }}
                /> : null
            )}
        </div>
    )
}

export default AnecdoteList