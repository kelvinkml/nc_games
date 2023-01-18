const express = require('express')
const app = express()
app.use(express.json())
const {getCategories, getReviews, getReviewById, getComments, postComment} = require('./controller')

app.get('/api/categories', getCategories)
app.get('/api/reviews', getReviews)
app.get('/api/reviews/:review_id', getReviewById)
app.get('/api/reviews/:review_id/comments', getComments)

app.post('/api/reviews/:review_id/comments', postComment)

app.use((err, request, response, next) =>{
    if(err.status&&err.msg){
        response.status(err.status).send({msg: err.msg})
    }next(err)
})


app.use((err, request, response, next) =>{
    if(err.code === '22P02'){
        response.status(400).send({msg: 'Bad Request!'})
    }
})
module.exports = app



