import { useState } from 'react'

const Header = ({ text }) => <h1>{text}</h1>

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const Section = ({ title, anecdote, votes }) => {
  return (
    <div>
      <Header text={title} />
      <p>{anecdote}</p>
      <p>has {votes} votes</p>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]
  const size = anecdotes.length
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Uint8Array(size))
  const [maxVotes, setMaxVotes] = useState(0)
  
  const handleNextAnecdote = () => {
    let randomIndex = Math.floor(Math.random() * size)
    setSelected(randomIndex)
  }
  
  const handleVote = () => {
    let votesCopy = [...votes]
    votesCopy[selected] += 1
    setVotes(votesCopy)

    const maxVote = Math.max(...votesCopy)
    const maxVotesIndex = votesCopy.indexOf(maxVote)
    setMaxVotes(maxVotesIndex)
  }

  return (
    <div>
      <Section title="Anecdote of the day" anecdote={anecdotes[selected]} votes={votes[selected]} />
      <Button onClick={handleVote} text="vote"/>
      <Button onClick={handleNextAnecdote} text="next anecdote"/>
      <Section title="Anecdote with most votes" anecdote={anecdotes[maxVotes]} votes={votes[maxVotes]} />
    </div>
  )
}

export default App