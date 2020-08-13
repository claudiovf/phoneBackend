const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('useFindAndModify', false)


const url =  process.env.MONGODB_URI


mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
	.then(() => {
		console.log('Connected to MongoDB')
	})
	.catch((error) => {
		console.log('Error connecting MongoDB: ', error)
	})

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
		required: true,
		unique: true
	},
	number: {
		type: String,
		minlength: 8,
		required: true
	},
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
	transform: (document, returnedObj) => {
		returnedObj.id = returnedObj._id.toString()
		delete returnedObj._id
		delete returnedObj.__v
	}
})


module.exports = mongoose.model('Person', personSchema)