const db = require("./db/connection")

const fetchCategories = ()=>{
   return db.query(`SELECT * FROM categories;`)
}
const fetchReviews = ()=>{
   return db.query(`SELECT * FROM reviews;`).then((reviews)=>{
      return {reviews:reviews.rows}
   })
}
const fetchReviewById = (reviewId) => {
   return db.query(`SELECT * FROM reviews WHERE reviews.review_id = $1`, [reviewId]).then((review)=>{
      if (review.rows.length === 0){
         return Promise.reject({status:404, msg:'Not Found!'})
      }
      else return {review : review.rows}
   })
}

module.exports = {fetchCategories, fetchReviews, fetchReviewById}