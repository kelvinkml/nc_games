const { response } = require("./app")
const db = require("./db/connection")

const fetchCategories = ()=>{
   return db.query(`SELECT * FROM categories;`)
}
const fetchReviews = ()=>{
   return db.query
   (`SELECT reviews.* , COUNT(reviews.review_id) AS comment_count 
   FROM reviews
   LEFT JOIN comments ON reviews.review_id = comments.review_id
   GROUP BY reviews.review_id
   ORDER BY created_at DESC;`)
   .then((reviews)=>{
      return {reviews:reviews.rows}
   })
}
const fetchReviewById = (reviewId) => {
   return db.query(`SELECT reviews.* , COUNT(reviews.review_id) AS comment_count 
   FROM reviews
   LEFT JOIN comments ON reviews.review_id = comments.review_id
   WHERE reviews.review_id = $1
   GROUP BY reviews.review_id;`, [reviewId]).then((review)=>{
      if (review.rows.length === 0){
         return Promise.reject({status:404, msg:'Not Found!'})
      }
      else 
      return {review : review.rows}
   })
}

const fetchComments = (reviewId) => {
   return db.query(`
   SELECT * FROM comments
   WHERE comments.review_id = $1
   ORDER BY created_at DESC
   ;`, [reviewId]).then((comments)=>{
      if(comments.rows.length === 0){
         return Promise.reject({status:404, msg:'Not Found!'})
      }
      else
      return {comments: comments.rows}
   })
}

module.exports = {fetchCategories, fetchReviews, fetchReviewById, fetchComments}