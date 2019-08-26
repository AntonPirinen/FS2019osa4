const blogsRouter = require('./controllers/blogs')
const bodyParser = require('body-parser')
const config = require('./utils/config')
const cors = require('cors')
const express = require('express')
var morgan = require('morgan')
//const middleware = require('.utils/middleware')
const mongoose = require('mongoose')

const app = express()

console.log('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(bodyParser.json())
morgan.token('post', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens.post(req, res)
    ].join(' ')
  }))

app.use('/api/blogs', blogsRouter)

module.exports = app