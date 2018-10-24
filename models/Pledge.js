var mongoose = require('mongoose')


module.exports = mongoose.model('Pledge', {    
    id: Number,
    name: String
})