import { connect } from 'react-redux/es/exports'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { createNotification } from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {
    const addAnecdote = async (event) => {
        event.preventDefault()
        
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        props.createAnecdote(content)
        props.createNotification(`you added '${content}'`, 5)
    }

    return (
        <form onSubmit={addAnecdote}>
            <h2>create new</h2>
            <div>
                <input name="anecdote" />
            </div>
            <button type="submit">create</button>
        </form>
    )
}

const mapDispatchToProps = {
    createAnecdote,
    createNotification,
}

export default connect(
    null,
    mapDispatchToProps
)(AnecdoteForm)