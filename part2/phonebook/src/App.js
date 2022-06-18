import { useState, useEffect } from 'react'
import personService from './services/persons'

const Header = ({ header }) => <h1>{header}</h1>

const Person = ({ person, deletePerson }) => {
  return (
    <li>
      {person.name} {person.number}
      <button onClick={deletePerson}>delete</button>
    </li>
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

const Filter = ({ search, handleSearch }) => {
  return (
    <label>
      filter shown with <input value={search} onChange={handleSearch} />
    </label>
  )
}

const Notification = ({ type, message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={`${type} message`}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [personsToShow, setPersonsToShow] = useState([])
  const [message, setMessage] = useState({ type: '', text: null })

  useEffect(() => {
    personService
      .getAll()
      .then(persons => {
        setPersons(persons)
        setPersonsToShow(persons)
      })
  }, [])

  const removeMessage = () => {
    setTimeout(() => {
      setMessage({ type: '', text: null })
    }, 5000);
  }
  
  const addName = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber
    }
    const existingPerson = persons.find(person => person.name === newPerson.name)

    if (!existingPerson) {
      personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setPersonsToShow(persons.concat(returnedPerson))
        setMessage({ type:'success', text:`Added ${returnedPerson.name}` })
      })
    } else {
      if (window.confirm(
        `${existingPerson.name} is already added to phonebook, replace the old number with a new one?`
      )) {
        personService
          .update(existingPerson.id, newPerson)
          .then(returnedPerson => {
            const updatedPersons = persons.map(person => person.id !== existingPerson.id ? person : returnedPerson)
            setPersons(updatedPersons)
            setPersonsToShow(updatedPersons)
            setMessage({ type:'success', text:`Updated ${returnedPerson.name}` })
          })
          .catch(() => {
            setMessage({ type:'error', text:`Information of ${existingPerson.name} has already been removed from server` })
            const updatedPersons = persons.filter(person => existingPerson.id !== person.id)
            setPersons(updatedPersons)
            setPersonsToShow(updatedPersons)
          })
      }
    }

    setNewName('')
    setNewNumber('')
    removeMessage()
  }

  const deleteName = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          const updatedPersons = persons.filter(person => person.id !== id)
          setPersons(updatedPersons)
          setPersonsToShow(updatedPersons)
        })
    }
  }
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  
  const handleSearch = (event) => {
    const search = event.target.value
    setSearch(search)
    const searchCopy = persons.filter(person => person.name.toLowerCase().includes(search))
    setPersonsToShow(searchCopy)
  }

  return (
    <div>
      <Header header='Phonebook' />
      <Notification type={message.type} message={message.text} />
      <Filter search={search} handleSearch={handleSearch} />
      <Header header='Add a new' />
      <Form addName={addName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <Header header='Numbers' />
      <ul>
        {personsToShow.map(person => 
          <Person key={person.id} person={person} deletePerson={() => deleteName(person.id, person.name)} />  
        )}
      </ul>
    </div>
  )
}

export default App;