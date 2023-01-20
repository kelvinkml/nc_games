const express = require('express')
const app = express()
app.use(express.json())
const {getCategories, getReviews, getReviewById, getComments, postComment, patchReview, getUsers, deleteCommentById, getAllComments} = require('./controller')

app.get('/api/categories', getCategories)
app.get('/api/reviews', getReviews)
app.get('/api/reviews/:review_id', getReviewById)
app.get('/api/reviews/:review_id/comments', getComments)
app.get('/api/users', getUsers)
app.get('/api/comments', getAllComments)

app.post('/api/reviews/:review_id/comments', postComment)

app.patch('/api/reviews/:review_id', patchReview)

app.delete('/api/comments/:comment_id', deleteCommentById)

app.use((err, request, response, next) =>{
    if(err.status&&err.msg){
        response.status(err.status).send({msg: err.msg})
    }next(err)
})

app.use((err, request, response, next)=>{
    if(err.code === '23502'){
        response.status(400).send({msg: 'Bad post request!'})
    }next(err)
})

app.use((err, request, response, next) => {
    if(err.code === '23503'){
        response.status(404).send({msg : err.detail})
    }next(err)
})
app.use((err, request, response, next) =>{
    if(err.code === '22P02'){
        response.status(400).send({msg: 'Bad Request!'})
    }
})
module.exports = app


