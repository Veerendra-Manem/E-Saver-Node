var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var app = express()
var jwt = require('jwt-simple')

var User = require('./models/User.js')
var Post = require('./models/Post.js')
var auth = require('./auth.js')

mongoose.Promise = Promise

app.use(cors())
app.use(bodyParser.json())

app.get('/posts/:id', async (req, res) => {
    var author = req.params.id
    var posts = await Post.find({ author })
    res.send(posts)
})

app.get('/profile', auth.checkAuthenticated, async (req, res) => {
    try {
        var user = await User.findById(req.userId, '-pwd -__v')
        res.send(user)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
})

app.get('/profile/posts', auth.checkAuthenticated, async (req, res) => {
    var author = req.userId
    var posts = await Post.find({ author })
    res.send(posts)
})

app.get('/profile/todayposts', auth.checkAuthenticated, async (req, res) => {
    var author = req.userId
    var date = new Date().toDateString();
    var posts = await Post.find({ author,date })
    res.send(posts)
})

app.post('/post', auth.checkAuthenticated, (req, res) => {
    var postData = req.body
    postData.author = req.userId

    var post = new Post(postData)

    post.save((err, result) => {
        if (err) {
            console.error('saving post error')
            return res.status(500).send({ message: 'saving post error' })
        }

        res.sendStatus(200)
    })
})

app.get('/users', async (req, res) => {
    try {
        var users = await User.find({}, '-pwd -__v')
        // console.log(users)
        // users.forEach(user => {
        //     console.log(user)
        //     var posts = Post.find({ user })
        //     console.log(posts.count)
        //     for(var i=0; i < posts.count; i ++) {
        //         console.log(posts[i])
        //         user.score = (user.score === undefined ? 0 : user.score) + posts[i].score;
        //     }            
        // })
        res.send(users)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
})

app.get('/profile/:id', async (req, res) => {
    try {
        var user = await User.findById(req.params.id, '-pwd -__v')
        res.send(user)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
})

mongoose.connect('mongodb://test:test123@ds033487.mlab.com:33487/esaver', {useNewUrlParser: true},(err) => {
    if(!err)
        console.log('connected to mongo')
}
    )

app.use('/auth', auth.router)
app.listen(3000)