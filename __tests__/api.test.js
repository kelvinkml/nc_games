const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data')
const request = require('supertest')
const app = require('../app')
const db = require('../db/connection')

beforeEach(()=> seed(testData))

afterAll(()=> db.end())

jest.setTimeout(2000)

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
            expect(err.body.msg).toBe(`Key (review_id)=(100) is not present in table \"reviews\".`)
        })
    })
    test('responds with 400 bad request when passed an invalid id', ()=>{
        const commentToPost = {
            body: 'test',
            username: 'philippaclaire9',
        }
        return request(app).post('/api/reviews/notAReview/comments').send(commentToPost).expect(400)
        .then((result)=>{
            expect(result.body.msg).toBe("Bad Request!")
        })
    })
    test('responds with 404 when using invalid username', ()=>{
        const commentToPost = {
            body: 'test',
            username: 'notAUserName',
        }
        return request(app).post('/api/reviews/2/comments').send(commentToPost).expect(404).then((result)=>{
            expect(result.body.msg).toBe(`Key (author)=(notAUserName) is not present in table \"users\".`)
        })
    })
    test('responds with 400 bad request when passing an invalid object to post', ()=>{
        const commentToPost = {
            notABody: 'test',
            notAUser: 'philippaclaire9',
        }
        return request(app).post('/api/reviews/2/comments').send(commentToPost).expect(400).then((result)=>{
            expect(result.body.msg).toBe(`Bad post request!`)
        })
    })
})

describe('PATCHING votes onto comments', ()=>{
    test('responds with 200', ()=>{
        const updateVotes = {inc_votes: 1}
        return request(app).patch('/api/reviews/2').send(updateVotes).expect(200)
    })
    test('updates vote count with + inc_votes', ()=>{
        const updateVotes = {inc_votes: 1}
        return request(app).patch('/api/reviews/1').send(updateVotes).expect(200).then((review)=>{
            expect(review.body[0].votes).toBe(2)
        })
    })
    test('updated vote count with - inc_votes and resets to 0 if votes is a negative number', ()=>{
        const negativeVotes = {inc_votes: -10}
        return request(app).patch('/api/reviews/1').send(negativeVotes).expect(200).then((review)=>{
            expect(review.body[0].votes).toBe(-9)
        })
    })
    test('returns with 404 when an id is not found', ()=>{
        const updateVotes = {inc_votes: 1}
        return request(app).patch('/api/reviews/100').send(updateVotes).expect(404).then((response)=>{
            expect(response.body.msg).toBe('Not Found!')
        })
    })
    test('returns 400 bad request when inc_votes is not accepted data type', ()=>{
        const updateVotes = {inc_votes: 'string'}
        return request(app).patch('/api/reviews/1').send(updateVotes).expect(400).then((response)=>{
            expect(response.body.msg).toBe('Bad Request!')
        })
    })
    test('returns 400 bad request when passed invalid key', ()=>{
        const updateVotes = {notVotes: 1}
        return request(app).patch('/api/reviews/1').send(updateVotes).expect(400).then((response)=>{
            expect(response.body.msg).toBe('Bad Request!')
        })
    })
})

describe('GET users', ()=>{
    test('responds with 200', ()=>{
        return request(app).get('/api/users').expect(200)
    })
    test('users array contains the correct properties', ()=>{
        return request(app).get('/api/users').expect(200).then((users)=>{
            const output = users.body.users
            output.forEach((user)=>{
                expect(user).toHaveProperty('username', expect.any(String))
                expect(user).toHaveProperty('name', expect.any(String))
                expect(user).toHaveProperty('avatar_url', expect.any(String))
            })
        })
    })
    test('users array returns correct number of users', ()=>{
        return request(app).get('/api/users').expect(200).then((users)=>{
            const output = users.body.users
            expect(output).toHaveLength(4)
        })
    })
})

describe('GET reviews with queries', ()=>{
    test('returns status 200', () =>{
        return request(app).get('/api/reviews?category=dexterity').expect(200)
    })
    test('returns all reviews with matching category', ()=>{
        return request(app).get('/api/reviews?category=dexterity').expect(200).then((response)=>{
            const output = response.body.reviews[0]
            expect(output.category).toBe('dexterity')
        })
    })
    test('returns all reviews with matching 2 word category', ()=>{
        return request(app).get('/api/reviews?category=social_deduction').expect(200).then((reviews)=>{
            const output = reviews.body.reviews
            output.forEach((review)=>{
                expect(review.category).toBe('social deduction')
            })
        })
    })
    test('returns all arrays with matching category with custom sorting', ()=>{
        return request(app).get('/api/reviews?category=social_deduction&sort_by=votes')
        .expect(200).then((reviews)=>{
            const output = reviews.body.reviews
            expect(output).toBeSorted({descending: 'true', key : 'votes'})
        })
    })
    test('custom order by query', ()=>{
        return request(app).get('/api/reviews?category=social_deduction&sort_by=votes&order_by=ASC')
        .expect(200).then((reviews)=>{
            const output = reviews.body.reviews
            expect(output).toBeSorted({ascending: 'true', key : 'votes'})
        })
    })
    test('returns 400 bad request when passed invalid category', ()=>{
        return request(app).get('/api/reviews?category=notacategory').expect(400).then((result)=>{
            expect(result.body.msg).toBe('Invalid Category')
        })
    })
    test('returns 400 bad request when passed invalid sort query', ()=>{
        return request(app).get('/api/reviews?category=social_deduction&sort_by=invalid').expect(400).then((result)=>{
            expect(result.body.msg).toBe('Invalid sort query')
        })
    })
    test('returns 400 bad request when passed invalid order by', ()=>{
        return request(app).get('/api/reviews?category=social_deduction&sort_by=votes&order_by=notASC').expect(400).then((result)=>{
            expect(result.body.msg).toBe('Invalid order statement')
        })
    })
})

describe('checkCategories for get reviews', ()=>{
    test('returns 200', ()=>{
        return request(app).get('/api/reviews?category=social_deduction').expect(200)
    })
    test('returns correct reviews based on category after passing through checkCat function', ()=>{
        return request(app).get('/api/reviews?category=social_deduction').expect(200).then((reviews)=>{
            const output = reviews.body.reviews
            output.forEach((review)=>{
                expect(review.category).toBe('social deduction')
            })
        })
    })
})
