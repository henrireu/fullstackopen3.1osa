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
  
  app.get('/api/persons', (request, response, next) => {
    Person.find({})
      .then(persons => {
        response.json(persons)
      })
      .catch(error => next(error))
  })

  app.get('/info', (request, response, error) => {
    Person.countDocuments({})
      .then(count => {
        const teksti1 = `<p>Phonebook has info for ${count} people </p>`
        const aika = new Date()
        response.send(teksti1 + aika)
      })
      .catch(error => next(error))
  })

  app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
      .then(person => {
        if (person) {
          response.json(person)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
  })

  app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })

  app.post('/api/persons', (request, response, next) => {
    console.log(request.body)
    const body = request.body

    const person = new Person({
      name: body.name,
      number: body.number,
    })

    person.save()
      .then(savedPerson => {
        response.json(savedPerson)
      })
      .catch(error => next(error))
  })

  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
      name: body.name,
      number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })

  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
    next(error)
  }
  
  app.use(errorHandler)

  
  const port = process.env.PORT 
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })