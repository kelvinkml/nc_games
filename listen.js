const app = require('./app')
const format = require('pg-format')
const {PORT = 9090} = process.env


app.listen(PORT, ()=> console.log(`listening on ${PORT}`))