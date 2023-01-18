const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data')
const request = require('supertest')
const app = require('../app')
const db = require('../db/connection')

beforeEach(()=> seed(testData))

afterAll(()=> db.end())



describe('api/categories', ()=>{
    test('responds with status code 200', ()=>{
        return request(app).get('/api/categories').expect(200)
    })
    test('responds with an array full of categories with slug and description properties', ()=>{
        return request(app).get('/api/categories').expect(200)
        .then((result)=>{
            expect(result.body[0]).toHaveProperty('slug', expect.any(String))
            expect(result.body[0]).toHaveProperty('description', expect.any(String))
            expect(result.body.length).toBe(4)
        })
    })
})

describe('api/reviews', ()=>{
    test('responds with status code 200', ()=>{
        return request(app).get('/api/reviews').expect(200)
    })
    test('responds with an array full of reviews with correct categories', ()=>{
        return request(app).get('/api/reviews')
        .then((result)=>{
            const output = result.body.reviews
            expect(output).toHaveLength(13)
            output.forEach((review)=>{
                expect(review).toHaveProperty('title', expect.any(String))
                expect(review).toHaveProperty('designer', expect.any(String))
                expect(review).toHaveProperty('owner', expect.any(String))
                expect(review).toHaveProperty('review_img_url', expect.any(String))
                expect(review).toHaveProperty('review_body', expect.any(String))
                expect(review).toHaveProperty('category', expect.any(String))
                expect(review).toHaveProperty('created_at', expect.any(String))
                expect(review).toHaveProperty('votes', expect.any(Number))
                expect(review).toHaveProperty('comment_count', expect.any(String))
            })
        })
    })
})

describe('api/review/:review_id', ()=>{
    test('responds with 200', ()=>{
        return request(app).get('/api/reviews/1').expect(200)
    })
    test('responds with a single review by id', ()=>{
        return request(app).get('/api/reviews/1').expect(200).then((review)=>{
            const output = review.body.review[0]
            expect(output).toHaveProperty('title', expect.any(String))
            expect(output).toHaveProperty('designer', expect.any(String))
            expect(output).toHaveProperty('owner', expect.any(String))
            expect(output).toHaveProperty('review_img_url', expect.any(String))
            expect(output).toHaveProperty('review_body', expect.any(String))
            expect(output).toHaveProperty('category', expect.any(String))
            expect(output).toHaveProperty('created_at', expect.any(String))
            expect(output).toHaveProperty('votes', expect.any(Number))
            expect(output).toHaveProperty('comment_count', expect.any(String))
        })
    })
    test('responds with 404 Not Found when passed resource that doesnt exist', ()=>{
        return request(app).get('/api/reviews/9999').expect(404).then((err)=>{
            expect(err.body.msg).toBe("Not Found!")
        })
    })
    test('responds with 400 bad request when passed invalid id', ()=>{
        return request(app).get('/api/reviews/eggs').expect(400).then((err)=>{
            expect(err.body.msg).toBe('Bad Request!')
        })
    })
})

describe('/get/reviews/:review_id/comments', ()=>{
    test('responds with 200', ()=>{
        return request(app).get('/api/reviews/3/comments').expect(200)
    })
    test('responds with an array of comments when passed a review ID', ()=>{
        return request(app).get('/api/reviews/2/comments').expect(200).then((result)=>{
            const output = result.body.comments
            // console.log(output)
            expect(output.length).toBe(3)
            output.forEach((comment)=>{
                expect(comment).toHaveProperty('comment_id', expect.any(Number))
                expect(comment).toHaveProperty('body', expect.any(String))
                expect(comment).toHaveProperty('votes', expect.any(Number))
                expect(comment).toHaveProperty('author', expect.any(String))
                expect(comment).toHaveProperty('review_id', expect.any(Number))
                expect(comment).toHaveProperty('created_at', expect.any(String))
            })
        })
    })
    test('results should be in order of created first', ()=>{
        return request(app).get('/api/reviews/2/comments').expect(200).then((result)=>{
            const output = result.body.comments
            expect(output).toBeSorted({descending: 'true', key : 'created_at'})
        })
    })
    test('responds with custom message when no comments are found', ()=>{
        return request(app).get('/api/reviews/100/comments').expect(404)
        .then((err)=>{
            expect(err.body.msg).toBe("Not Found!")
        })
    })
    test('responds with 400 bad request when passed invalid id', ()=>{
        return request(app).get('/api/reviews/eggs/comments').expect(400).then((err)=>{
            expect(err.body.msg).toBe('Bad Request!')
        })
    })
})

describe('POST api/reviews/:review_id/comments', ()=>{
    test('returns 201', ()=>{
        const commentToPost = {
            body: 'test',
            username: 'philippaclaire9',
        }
        return request(app).post('/api/reviews/2/comments').send(commentToPost).expect(201)
        })
    test('returns the new comment data', ()=>{
            const commentToPost = {
                body: 'test',
                username: 'philippaclaire9',
            }
            return request(app).post('/api/reviews/2/comments').send(commentToPost).expect(201).then((response)=>{
                console.log(response.body.comment[0])
                const output = response.body.comment[0]
                expect(output).toHaveProperty('comment_id', expect.any(Number))
                expect(output).toHaveProperty('body', expect.any(String))
                expect(output).toHaveProperty('review_id', expect.any(Number))
                expect(output).toHaveProperty('author', expect.any(String))
                expect(output).toHaveProperty('votes', expect.any(Number))
                expect(output).toHaveProperty('created_at', expect.any(String))
            })
        })
    test('responds with 404 not found when no reviews are found', ()=>{
        const commentToPost = {
            body: 'test',
            username: 'philippaclaire9',
        }
        return request(app).post('/api/reviews/100/comments').send(commentToPost).expect(404)
        .then((err)=>{
            expect(err.body.msg).toBe("You can't comment on a review that doesn't exist!")
        })
    })
    test('responds with 400 bad request when passed an invalid id', ()=>{
        const commentToPost = {
            body: 'test',
            username: 'philippaclaire9',
        }
        return request(app).post('/api/reviews/notAReview/comments').send(commentToPost).expect(400)
        .then((result)=>{
            expect(result.body.msg).toBe("Invalid Id, please enter a number.")
        })
    })
})
