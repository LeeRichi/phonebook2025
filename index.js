const express = require('express')
const app = express()
const morgan = require('morgan');
const cors = require('cors')

app.use(cors())

app.use(morgan('tiny'));
app.use(express.json())

app.use((req, res, next) => {
  console.log('Request Body:', req.body);
  next();
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

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

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) =>
{
	const id = req.params.id

	persons = persons.filter(person => person.id != id)
	res.status(204).end()
})

app.get('/info', (request, response) => {
  const count = persons.length;
  const currentTime = new Date().toLocaleString(); // Get the local time
  response.send(`<p>Phonebook has info for ${count} people</p><p>Current local time: ${currentTime}</p>`);
});

app.post('/api/persons', (req, res) =>
{
	const new_person = req.body

	if (persons.find(person => person.name === new_person.name))
	{
		return res.status(400).json({ error: "Person already exists." });
	}
	if (!new_person.name || !new_person.number)
	{
		return res.status(400).json({ error: "The name or number is missing." });
	}
	new_person.id = Math.floor(Math.random() * 1000000);

	persons = persons.concat(new_person)

	res.status(201).json(new_person);
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
