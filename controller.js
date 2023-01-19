const { response } = require('./app')
const {fetchCategories, fetchReviews, fetchReviewById, fetchComments, newComment, updateVotes} = require('./model')

const getCategories = (request, response, next) => {
    fetchCategories()
        .then((categories)=>{
            response.status(200).send(categories.rows)
        })
        .catch(next)   
}

const getReviews = (request, response, next) => {
    fetchReviews()       
        .then((reviews)=>{
            response.status(200).send(reviews)
        }).catch(next)
}

const getReviewById = (request, response, next) =>{
    const {review_id} = request.params
    fetchReviewById(review_id).then((review)=>{
        response.status(200).send(review)
    }).catch(next)
}

const getComments = (request, response, next) =>{
    const {review_id} = request.params
    fetchComments(review_id).then((comments)=>{
        response.status(200).send(comments)
    })
    .catch(next)
}

const postComment = (request, response, next) =>{
    const {body} = request
    const {review_id} = request.params
    newComment(review_id, body).then((newComment)=>{
        response.status(201).send(newComment)
    })
    .catch(next)
}

const patchReview = (request, response, next) => {
    const {review_id} = request.params
    const {body} = request
    updateVotes(review_id, body).then((updatedReview)=>{
        const {review} = updatedReview
        response.status(200).send(review)
    })
    .catch(next)
}
module.exports = { getCategories, getReviews, getReviewById, getComments, postComment, patchReview }