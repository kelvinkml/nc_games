const db = require("./db/connection")

const fetchCategories = ()=>{
   return db.query(`SELECT * FROM categories;`)
}
const fetchReviews = ()=>{
   return db.query(`SELECT * FROM reviews;`)
}

module.exports = {fetchCategories, fetchReviews}