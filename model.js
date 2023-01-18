const { response } = require("./app")
const db = require("./db/connection")
const format = require('pg-format')


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

   const returnQuery = db.query(`
   SELECT * FROM comments
   WHERE comments.review_id = $1
   ORDER BY created_at DESC
   ;`, [reviewId])

   return Promise.all([returnQuery, fetchReviewById(reviewId)])
   .then((comments)=>{
      return {comments: comments[0].rows}
   })
}

const newComment = (review_id, comment) => {
   const {body, username} = comment
   const returnQuery = db.query(`INSERT INTO comments (body, review_id, author) VALUES ($1,$2,$3) RETURNING *`, [body, review_id, username])

   return Promise.all([returnQuery, fetchComments(review_id)])
   .then((comment)=>{
      return {comment: comment[0].rows}
   })
}

const updateVotes = (review_id, inc_votes) => {
   return db.query(`SELECT * FROM reviews;`).catch(next)
}
module.exports = {fetchCategories, fetchReviews, fetchReviewById, fetchComments, newComment, updateVotes}