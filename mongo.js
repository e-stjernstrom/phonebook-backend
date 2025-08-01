const mongoose = require('mongoose')

if (process.argv.length < 5 && process.argv.length !== 3) {
  console.log('Use "node mongo.js <yourpassword> <Name> <Number> to add person, "')
  console.log('or "node mongo.js <yourpassword> to list all people."')
  process.exit(1)
}

const passwd = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://fullstack:${passwd}@cluster0.bnf0w61.mongodb.net/phonebook?
retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) { // list all persons
  Person.find({}).then(result => {
    console.log('phonebook: ')
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
} else { // add single person
  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(result => {
    console.log(`added ${result.name} ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}