require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

morgan.token('type', (req, res) => (JSON.stringify(req.body)))

const app = express()

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

const Person = require('./models/person')

app.get('/info', (req, res) => {
  res.send(`
    <div>Phonebook has info for ${persons.length} people</div>
    <div>${new Date()}</div>
  `)
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(notes => {
    res.json(notes)
  })
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Person.findByIdAndDelete(req.params.id).then(result => {
    res.status(204).end()
  })
})

/*
const genID = (scale = 2) => {
  const random = Math.floor(Math.random() * Math.pow(10, scale)).toString().padStart(scale, '0')
  const id = Date.now().toString() + random
  return id
}
*/

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json(
      { error: 'name or number missing' }
    )
  }

  const person = new Person ({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson) // response output
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})