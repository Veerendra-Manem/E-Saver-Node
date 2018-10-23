var mongoose = require('mongoose')


module.exports = mongoose.model('Post', {
    date: String,
    items: Map,
    score: Number,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})