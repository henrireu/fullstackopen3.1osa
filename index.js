require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')

const cors = require('cors')

app.use(cors())
const morgan = require('morgan')
app.use(express.static('dist'))
app.use(express.json())

morgan.token('id', (request) => { 
  return request.id
})

morgan.token('request-body', function (request, response) {
  return JSON.stringify(request.body);
});

app.use(morgan(':id :method :url :status :res[content-length] - :response-time ms :request-body'))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

  app.get('/', (request, response) => {
    response.send('<h1>Localhost:3001</h1>')
  })
  
  /*app.get('/api/persons', (request, response) => {
    response.json(persons)
  })*/

  app.get('/info', (request, response) => {
    const teksti1 = `<p>Phonebook has info for ${persons.length} people </p>`
    const aika = new Date()
    
    response.send(teksti1 + aika)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if(!body.number) {
      return response.status(400).json({
        error: 'number missing'
      })
    }

    let totuus = false

    persons.map(person => {
      if (person.name === body.name) {
        totuus = true
      }
    })

    if (totuus === true) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 10000),
    }

    persons = persons.concat(person)

    response.json(person)
  })

  
  const port = process.env.PORT 
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })