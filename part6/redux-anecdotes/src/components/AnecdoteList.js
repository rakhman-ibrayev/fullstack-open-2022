import { useDispatch, useSelector } from 'react-redux/es/exports'
import { voteAnecdote } from '../reducers/anecdoteReducer'

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
        return state.sort((a, b) => b.votes - a.votes)
    })
    const dispatch = useDispatch()

    return (
        <div>
            {anecdotes.map(anecdote =>
                <Anecdote
                    key={anecdote.id}
                    anecdote={anecdote}
                    handleVote={() => {
                        dispatch(voteAnecdote(anecdote.id))
                    }}
                />
            )}
        </div>
    )
}

export default AnecdoteList