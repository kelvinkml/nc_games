const { response, use } = require('./app')
const {fetchCategories, fetchReviews, fetchReviewById, fetchComments, newComment, updateVotes, fetchAllUsers, checkCategories, deleteComment, fetchAllComments} = require('./model')

const getCategories = (request, response, next) => {
    fetchCategories()
        .then((categories)=>{
            response.status(200).send(categories.rows)
        })
        .catch(next)   
}

const getReviews = (request, response, next) => {
    const {order_by} = request.query
    let {category} = request.query
    const {sort_by} = request.query

    if(category){
        checkCategories(category).then((isCategory)=>{
            category = isCategory
        })
        .catch(next)
    }
    fetchReviews(category, sort_by, order_by)       
        .then((reviews)=>{
            response.status(200).send(reviews)
        })
    .catch(next)
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

const getUsers = (request, response, next) => {
    fetchAllUsers().then((result)=>{
        const users = {users : result.rows}
        response.status(200).send(users)
    })
    .catch(next)
}

const getAllComments = (request, response, next) => {
    fetchAllComments().then((allComments)=>{
        response.status(200).send(allComments)
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

const deleteCommentById = (request, response, next) => {
    const {comment_id} = request.params
    deleteComment(comment_id).then(()=>{
        response.status(204).send({status : 204})
    })
    .catch(next)
}
module.exports = { getCategories, getReviews, getReviewById, getComments, postComment, patchReview, getUsers, deleteCommentById, getAllComments}