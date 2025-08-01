const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

morgan.token('type', (req, res) => (JSON.stringify(req.body)))

const app = express()

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))


let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (req, res) => {
  res.send(`
    <div>Phonebook has info for ${persons.length} people</div>
    <div>${new Date()}</div>
  `)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})



const genID = (scale = 2) => {
  const random = Math.floor(Math.random() * Math.pow(10, scale)).toString().padStart(scale, '0')
  const id = Date.now().toString() + random
  return id
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json(
      { error: 'name or number missing' }
    )
  }

  if (persons.some(person => person.name === body.name)) {
    return res.status(400).json(
      { error: 'name must be unique' }
    )
  }

  const person = {
    id: genID(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  res.json(person) // response output
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})