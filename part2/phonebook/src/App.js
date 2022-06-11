import { useState } from 'react';

const Header = ({ header }) => <h1>{header}</h1>

const Person = ({ person }) => <li>{person.name} {person.number}</li>

const Persons = ({ persons }) => {
  return (
    <ul>
        {persons.map(person =>
          <Person key={person.id} person={person} />
        )}
    </ul>
  )
}

const Form = (props) => {
  return (
    <form onSubmit={props.addName}>
        <div>
          name: <input value={props.newName} onChange={props.handleNameChange} />
        </div>
        <div>
          number: <input value={props.newNumber} onChange={props.handleNumberChange} />
        </div>
        <div>
          <button type='submit'>add</button>
        </div>
    </form>
  )
}

const Filter = ({ handleSearch, searchResults}) => {
  return (
    <div>
      <input onChange={handleSearch} />
      <Persons persons={searchResults} />
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchResults, setSearchResults] = useState([...persons])
  
  const addName = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }
    
    if (persons.some(person => JSON.stringify(person) === JSON.stringify(newPerson))) {
      alert(`${newPerson.name} is already added to phonebook`)
      return
    }
    
    setPersons(persons.concat(newPerson))
    setSearchResults(persons.concat(newPerson))
    setNewName('')
    setNewNumber('')
  }
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  
  const handleSearch = (event) => {
    const search = event.target.value.toLowerCase()
    const searchCopy = persons.filter(res => res.name.toLowerCase().includes(search))
    setSearchResults(searchCopy)
  }

  return (
    <div>
      <Header header='Phonebook' />
      <Filter handleSearch={handleSearch} searchResults={searchResults} />
      <Header header='Add a new' />
      <Form addName={addName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <Header header='Numbers' />
      <Persons persons={persons} />
    </div>
  )
}

export default App;
