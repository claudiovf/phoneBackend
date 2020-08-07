const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()


morgan.token('data', req => JSON.stringify(req.body))

app.use(cors())

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))


// const requestLogger = (request, response, next) => {
//     console.log('Method:', request.method)
//     console.log('Path:  ', request.path)
//     console.log('Body:  ', request.body)
//     console.log('---')
//     next()
//   }
// app.use(requestLogger)

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)

    if(person) {
        res.json(person)
    }else{
        res.status(404).end()
    }
})

app.post('/api/persons', (req, res) => {
    const checkName = persons.find(p => p.name === req.body.name)

    if(!req.body.name || !req.body.number) {
        return res.status(400).json({
            error: 'Name or Number missing'
        })
    }else if(checkName){
        return res.status(400).json({
            error: `${checkName.name} already exist!`
        })
    }else{
    const newPerson = {
        name: req.body.name,
        number: req.body.number,
        id: Math.floor(Math.random()*100000)
    }

    persons = persons.concat(newPerson)
    res.json(newPerson)
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

app.get('/info', (req, res) => {
    const date = new Date()
    res.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>`
    )
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = env.process.PORT || 3001
app.listen(PORT)