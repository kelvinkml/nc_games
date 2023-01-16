const {fetchCategories} = require('./model')

const getCategories = (request, response, next) => {
    fetchCategories().then((categories)=>{
        response.status(200).send(categories.rows)
    })
    .catch(next)
}

module.exports = {getCategories}