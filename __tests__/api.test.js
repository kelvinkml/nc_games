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
            expect(result.body[0]).toHaveProperty('slug')
            expect(result.body[0]).toHaveProperty('description')
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
                expect(review).toHaveProperty('title')
                expect(review).toHaveProperty('designer')
                expect(review).toHaveProperty('owner')
                expect(review).toHaveProperty('review_img_url')
                expect(review).toHaveProperty('review_body')
                expect(review).toHaveProperty('category')
                expect(review).toHaveProperty('created_at')
                expect(review).toHaveProperty('votes')
                expect(review).toHaveProperty('comment_count')
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
            expect(output).toHaveProperty('title')
            expect(output).toHaveProperty('designer')
            expect(output).toHaveProperty('owner')
            expect(output).toHaveProperty('review_img_url')
            expect(output).toHaveProperty('review_body')
            expect(output).toHaveProperty('category')
            expect(output).toHaveProperty('created_at')
            expect(output).toHaveProperty('votes')
            expect(output).toHaveProperty('comment_count')
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