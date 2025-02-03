// require('dotenv').config()

// const mongoose = require('mongoose')

// // if (process.argv.length < 3) {
// //   console.log('give password as argument')
// //   process.exit(1)
// // }

// // const password = process.argv[2]

// // const url =
// //   `mongodb+srv://applerich0306:${password}@phonebook.wkqfb.mongodb.net/?retryWrites=true&w=majority&appName=phonebook`

// const url = process.env.MONGODB_URL;

// mongoose.set('strictQuery', false)
// mongoose.connect(url)
//   .then(result => {
//     console.log('connected to MongoDB')
//   })
//   .catch(error => {
//     console.log('error connecting to MongoDB:', error.message)
//   })

// const personSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// })

// const Person = mongoose.model('Person', personSchema)

// // Check if name and number arguments are missing
// if (process.argv.length === 3)
// {
// 	Person.find({}).then(result =>
// 	{
// 		console.log('phonebook: ');
//     result.forEach(person => {
//       console.log(`${person.name} ${person.number}`)
//     })
// 		mongoose.connection.close()
//   })
// }
// else
// {
// 	const person = new Person({
//     name: process.argv[3],
//     number: process.argv[4],
//   })

//   person.save().then(result => {
//     console.log(`Added ${person.name} ${person.number} to phonebook`)
// 		mongoose.connection.close()
//   })
// }
