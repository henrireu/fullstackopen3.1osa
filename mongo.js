const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

if (process.argv.length === 3) {
    const password = process.argv[2]

    const url =
    `mongodb+srv://henkkareunanen8:${password}@cluster0.jxbtvfy.mongodb.net/personApp?retryWrites=true&w=majority`

    mongoose.set('strictQuery', false)
    mongoose.connect(url)

    const personSchema = new mongoose.Schema({
        name: String,
        number: String,
    })
    
    const Person = mongoose.model('Person', personSchema)
    
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
    })
}

if (process.argv.length === 5) {
    const password = process.argv[2]

    const url =
    `mongodb+srv://henkkareunanen8:${password}@cluster0.jxbtvfy.mongodb.net/personApp?retryWrites=true&w=majority`

    mongoose.set('strictQuery', false)
    mongoose.connect(url)

    const personSchema = new mongoose.Schema({
        name: String,
        number: String,
    })

    const Person = mongoose.model('Person', personSchema)

    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then(result => {
        console.log('person saved!')
        mongoose.connection.close()
    })
}



