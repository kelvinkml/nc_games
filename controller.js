const { response } = require('./app')
const {fetchCategories, fetchReviews} = require('./model')

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
            // console.log(reviews.rows)
            response.status(200).send(reviews.rows)
        }).catch(next)
}


module.exports = { getCategories, getReviews }