import { useState } from 'react'

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const Header = ({ text }) => <h1>{text}</h1>

const StatisticLine = ({ statTitle, number }) => {
  return (<tr>
    <td>{statTitle}</td>
    <td>{number}</td>
  </tr>)
}

const Statistics = ({ good, neutral, bad }) => {
  if (good === 0 && neutral === 0 && bad === 0) {
    return <p>No feedback given</p>
  }
  
  const all = good + neutral + bad
  const average = (good - bad) / 3
  const positive = all > 0 ? (good * 100) / all : 0
  
  return (
    <table>
      <tbody>
        <StatisticLine statTitle="good" number={good} />
        <StatisticLine statTitle="neutral" number={neutral} />
        <StatisticLine statTitle="bad" number={bad} />
        <StatisticLine statTitle="all" number={all} />
        <StatisticLine statTitle="average" number={average} />
        <StatisticLine statTitle="positive" number={positive + ' %'} />
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  
  const increment = (state, setState) => {
    setState(state + 1)
  }

  return (
    <div>
      <Header text="give feedback"/>
      <Button onClick={() => increment(good, setGood)} text="good" />
      <Button onClick={() => increment(neutral, setNeutral)} text="neutral" />
      <Button onClick={() => increment(bad, setBad)} text="bad" />
      <Header text="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App;