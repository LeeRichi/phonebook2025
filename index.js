const express = require('express')
const app = express()
const morgan = require('morgan');
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const Person = require('./models/person');

const url = process.env.MONGODB_URL;
console.log('connecting to', url)

mongoose.set('strictQuery',false)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(express.static('dist'))
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

app.get('/api/persons', (request, response, next) => {
	Person.find({}).then(persons => {
		response.json(persons)
	})
});

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
	// const person = persons.find(person => person.id === id)

	Person.findById(id)
		.then(person =>
		{
			if (person) {
				response.json(person)
			} else {
				response.status(404).end()
			}
		})
		.catch(error => next(error))

		// .catch(err =>
		// {
		// 	console.error("Error finding person:", err);
    //   response.status(400).send({ error: 'malformatted id' })
		// })
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;

	Person.findByIdAndDelete(id)
		.then(deletedPerson =>
		{
			console.log(deletedPerson)
      if (!deletedPerson) {
        return res.status(404).json({ error: "Person not found" });
      }
      res.status(204).json(`deleted ${deletedPerson.name} succesfully`);
		})
		.catch(error => next(error))

    // .catch(error => {
    //   console.error("Error deleting person:", error);
    //   res.status(500).json({ error: "Server error" });
    // });
});

app.get('/info', async(request, response) => {
	const count = await Person.countDocuments(); // ✅ Fetch count from MongoDB
  const currentTime = new Date().toLocaleString(); // Get the local time
  response.send(`<p>Phonebook has info for ${count} people</p><p>Current local time: ${currentTime}</p>`);
});

app.post('/api/persons', (req, res, next) =>
{
	const body = req.body

	if (!body.name || !body.number) {
		return res.status(400).json({ error: "The name or number is missing." });
	}

  const new_person = new Person({
    name: body.name,
    number: body.number,
	})

	new_person.save().then(savedPerson => {
    res.status(201).json(savedPerson)
	})
	.catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) =>
{
	const id = req.params.id;

	const updatedPerson =
	{
		name: req.body.name,
		number: req.body.number,
	}

	Person.findByIdAndUpdate(
		id,
		updatedPerson,
    { new: true, runValidators: true, context: 'query' }
	)
		.then(updatedPerson =>
		{
			if (!updatedPerson) {
        return res.status(404).json({ error: "Person not found" });
      }
			res.json(updatedPerson)
		})
		.catch(error => next(error))
})

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT

console.log(PORT)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
