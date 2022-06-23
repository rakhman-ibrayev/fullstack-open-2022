const express = require('express')
const morgan = require('morgan')
const app = express()
const PORT = 3000

app.use(express.json())

morgan.token('content', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>`
    )
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        res.send(
            `<p>${person.name}</p>
            <p>${person.number}</p>`
        )
    } else {
        res.status(404).end()
    }
})

const getNewId = () => {
    const max = 1000000
    const min = persons.length

    return Math.floor(Math.random() * (max - min) + min)
}

const isExisting = (name, number) => {
    const isNameExisting = persons.find(p => p.name === name)
    const isNumberExisting = persons.find(p => p.number === number)

    return isNameExisting || isNumberExisting ? true : false
}

app.post('/api/persons', (req, res) => {
    const body = req.body
    const name = body.name
    const number = body.number

    if (!name || !number) {
        return res.status(400).json({
            error: 'missing name or number'
        })
    }

    if (isExisting(name, number)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const newPerson = {
        "id": getNewId(),
        "name": name,
        "number": number.toString()
    }

    persons = persons.concat(newPerson)

    res.json(newPerson)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    
    res.status(204).end()
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})