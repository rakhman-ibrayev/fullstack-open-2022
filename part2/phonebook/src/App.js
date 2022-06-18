import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Form from './components/Form'
import Header from './components/Header'
import Notification from './components/Notification'
import Person from './components/Person'
import personService from './services/persons'

const App = () => {
	const [persons, setPersons] = useState([])
	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [search, setSearch] = useState('')
	const [message, setMessage] = useState({ type: '', text: null })

	useEffect(() => {
		personService
			.getAll()
			.then(persons => {
				setPersons(persons)
			})
	}, [])

	const notify = (message) => {
		setMessage(message)
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

		setNewName('')
		setNewNumber('')

		if (!existingPerson) {
			personService
				.create(newPerson)
				.then(returnedPerson => {
					setPersons(persons.concat(returnedPerson))
					notify({ type: 'success', text: `Added ${returnedPerson.name}` })
				})

			return
		}

		const ok = window.confirm(`${existingPerson.name} is already added to phonebook, replace the old number with a new one?`)

		if (ok) {
			personService
				.update(existingPerson.id, newPerson)
				.then(returnedPerson => {
					const updatedPersons = persons.map(person => person.id !== existingPerson.id ? person : returnedPerson)
					setPersons(updatedPersons)
					notify({ type: 'success', text: `Updated ${returnedPerson.name}` })
				})
				.catch(() => {
					notify({ type: 'error', text: `Information of ${existingPerson.name} has already been removed from server` })
					const updatedPersons = persons.filter(p => existingPerson.id !== p.id)
					setPersons(updatedPersons)
				})
		}
	}

	const deleteName = (id, name) => {
		if (window.confirm(`Delete ${name}?`)) {
			personService
				.remove(id)
				.then(() => {
					const updatedPersons = persons.filter(person => person.id !== id)
					setPersons(updatedPersons)
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
	}

	const personsToShow = persons.filter(person => person.name.toLowerCase().includes(search))

	return (
		<div>
			<Header header='Phonebook' />
			<Notification type={message.type} message={message.text} />
			<Filter search={search} handleSearch={handleSearch} />
			<Header header='Add a new' />
			<Form
				addName={addName}
				newName={newName}
				handleNameChange={handleNameChange}
				newNumber={newNumber}
				handleNumberChange={handleNumberChange}
			/>
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