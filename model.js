const { response } = require("./app")
const db = require("./db/connection")
const format = require('pg-format')
const { getAllComments } = require("./controller")


const fetchCategories = ()=>{
   return db.query(`SELECT * FROM categories;`)
}

const fetchReviews = (category, sort_by = 'created_at', order_by = 'DESC')=>{
   const acceptedOrder = ['ASC', 'DESC']
   const acceptedSort = ['votes', 'created_at', 'title', 'designer', 'owner']

   if(sort_by && !acceptedSort.includes(sort_by)){
      return Promise.reject({status : 400, msg : 'Invalid sort query'})
   }

   if(order_by && !acceptedOrder.includes(order_by)){
      return Promise.reject({status : 400, msg : 'Invalid order statement'})
   }

   const queryValues = []

   let queryStr = `SELECT reviews.* , COUNT(reviews.review_id) AS comment_count 
      FROM reviews
      LEFT JOIN comments ON reviews.review_id = comments.review_id `
   
   if(category){
      const categoryStr = category.replace('_', ' ')
      queryValues.push(`%${categoryStr}%`)
      queryStr += `WHERE category LIKE $1 `
   }

   queryStr +=  `GROUP BY reviews.review_id `
   
   queryStr += `ORDER BY ${sort_by} `

   queryStr += `${order_by}`

   return db.query(queryStr, queryValues)
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

const fetchAllComments = () => {
   return db.query(`SELECT * FROM comments ORDER BY created_at DESC;`).then((allComments)=>{
      return {comments : allComments}
   })
}

const fetchAllUsers = () => {
   return db.query(`SELECT * FROM users`)
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
   let incrementVotes = inc_votes.inc_votes
   if(!+incrementVotes){
      return Promise.reject({status:400,msg:'Bad Request!'})
   }
   if(inc_votes.inc_votes > 0){
      incrementVotes = `+${inc_votes.inc_votes}`
   }
   let queryStr = `UPDATE reviews SET votes = votes ${incrementVotes} WHERE review_id = ${review_id} RETURNING *`

   const dbQuery = db.query(queryStr)
   return Promise.all([dbQuery, fetchComments(review_id) ]).then((review)=>{
      return {review : review[0].rows}
   })
}

const checkCategories = (category) => {
   if(!category){
      return 'No Category'
   }
   const categoryStr = category.replace('_', ' ')
   return db.query(`SELECT * FROM reviews WHERE category = '${categoryStr}'`).then((categories)=>{
      if (categories.rows.length === 0){
         return Promise.reject({status:400, msg:'Invalid Category'})
      }
      else return category
   })
}

const deleteComment = (commentId) => {
   if(!+commentId){
      return Promise.reject({status: 400, msg: 'Bad Request'})
   }
   const checkComment = db.query(`SELECT * FROM comments WHERE comment_id = ${commentId}`).then((checkedComment)=>{
      if(!checkedComment.rowCount){
         return Promise.reject({status: 404, msg: 'Not Found'})
      }
   })
   const dbQuery = db.query(`DELETE FROM comments WHERE comment_id = ${commentId};`)
   return Promise.all([dbQuery, checkComment]).then(()=>{
      return {status: 204, msg: 'No Content'}
   })

}
module.exports = {fetchCategories, fetchReviews, fetchReviewById, fetchComments, newComment, updateVotes, fetchAllUsers, checkCategories, deleteComment, fetchAllComments}
