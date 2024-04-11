const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(oe) {
        let totuus = false
        if(oe[2] === '-' || oe[3] === '-') {
          totuus = true
        } 
        if(oe.length < 8) {
          totuus = false
        }
        const goodCharacters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-']
        
        for (let x = 0; x < oe.length; x++) {
          if (!goodCharacters.includes(oe[x])) {
            totuus = false
          }
        }
        
        return totuus
      },
      message: 'must be at least 8 numbers and contain "-"'
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)