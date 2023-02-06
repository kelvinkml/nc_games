V1

Link to hosted version: https://nc-games-qb66.onrender.com

In this project I have created an Express api that allows users to GET, POST, PATCH and DELETE from a database of board game reviews as well as add custom queries to sort by and return all reviews based on category as well as sort by votes, date, title, designer etc.

Database

Categories:

Included in the database are a categories table that can be fetched using /api/categories. In future versions users will be able to post new categories with an object. Currently this api endpoint is used primarily to check a category query exists on the database before passing it into /api/reviews. 

Comments:

The comments table contains all of the replies to our reviews referenced by the review_id and can be accessed by /get/reviews/:review_id/comments, this will return all of the comments attatched to that review.

Reviews:

The reviews table can be accessed with multiple endpoints depending on requirements, either without a review_id to return all of the reviews or with a review_id to access one particular review. 

Users:

The users table can be accessed with /api/users and this will return all users.

Endpoints: 

GET
/api/categories - returns all categories
/api/reviews - returns all reviews
/api/reviews/:review_id -this returns reviews based on the review ID
/api/reviews/:review_id/comments - this returns all comments on the review
/api/users - returns all users

POST
/api/reviews/:review_id/comments posts a new comment under the selected review

PATCH
/api/reviews/:review_id/comments patches the votes value and increments the votes

DELETE
/api/comments/:comment_id deletes the comment based on the comment id passed

Install dependencies using:
npm install

Install developer dependencies using:
npm install -D

Initiate using:
npm init

To set up and seed the local database use the following commands:
npm run setup-dbs
npm run seed

Tests are included for the api and run using jest, you will also need jest-extended and jest-sorted as well as supertest (which are a part of the developer dependencies)

To run the tests please do the following:
created a .env.test file similar to the example given. 
once this is done run the following command:
npm run test api

This will run the api.test.js file located in the './__tests__' folder

To run this in a production environment you will need to create another dotenv file called .env.production and you will need to set the DATABASE_URL=[your url here]. 

Minimum version requirements: 
node.js^19.4.0
postgres (PostgreSQL)^14.6
