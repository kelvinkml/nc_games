const { response } = require('./app')
const {fetchCategories, fetchReviews, fetchReviewById} = require('./model')

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
    const reviewId = request.params.review_id
    fetchReviewById(reviewId).then((review)=>{
        response.status(200).send(review)
    }).catch(next)
}


module.exports = { getCategories, getReviews, getReviewById }