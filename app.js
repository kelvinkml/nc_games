const express = require('express')
const app = express()
const get = express()
app.use(express.json())

const {getCategories} = require('./controller')

app.get('/api/categories', getCategories)


module.exports = app



