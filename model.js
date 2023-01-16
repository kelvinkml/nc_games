const db = require("./db/connection")

const fetchCategories = ()=>{
   return db.query(`SELECT * FROM categories;`)
}

module.exports = {fetchCategories}