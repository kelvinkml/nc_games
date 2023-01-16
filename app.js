const express = require('express')
const app = require('../be-mitchs-rare-treasures/app')
const get = express()
app.use(express.json())

const {getCategories} = require('./controller')

app.get('/api/categories', getCategories)

app.use((err, req, res, next) => {
    console.log('are we there yet??')
  });
// //psql error
// app.use((err, req, res, next) => {
//     if (err.code === '22P02') {
//       res.status(400).send({ msg: 'Invalid input' });
//     } else next(err);
//   });

//   app.use((err, req, res, next) => {
//     res.status(500).send('Server Error!');
//   });

module.exports = app



