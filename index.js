require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()


morgan.token('data', req => JSON.stringify(req.body))

app.use(cors())

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(express.static('build'))


app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(result => {
            res.json(result)
        })
    
})

app.get('/api/persons/:id', (req, res, next) => {
    Person
        .findById(req.params.id)
        .then(result => {
            if(result) {
                res.json(result)
            }else{
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
 
    if(!req.body.name || !req.body.number) {
        return res.status(400).json({
            error: 'Name or Number missing'
        })

    }else{
        const newPerson = new Person({
            name: req.body.name,
            number: req.body.number,
        })

        newPerson
        .save()
        .then(result => {
            res.json(result)
        })
    }
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person
        .findByIdAndDelete(req.params.id)
        .then( result => {
            console.log('deleted ', result.name)
        })
        .catch(error => next(error))
})

app.get('/info', (req, res) => {
    const date = new Date()

    Person
        .find({})
        .then(result => {
            res.send(
                `<p>Phonebook has info for ${result.length} people</p>
                <p>${date}</p>`
            )
        })
})

app.put('/api/persons/:id', (req, res, next) => {

    const body = req.body

    const newPerson = { 
        name: body.name,
        number: body.number, 
    }


    Person.findByIdAndUpdate(body.id, newPerson, {new: true})
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})


const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
