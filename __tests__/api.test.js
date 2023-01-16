const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data')
const request = require('supertest')
const app = require('../app')
const db = require('../db/connection')
const express = require('express')
app.use(express.json())

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
            console.log(result.body.length)
            result.body.forEach((review)=>{
                expect(review).toHaveProperty('title')
                expect(review).toHaveProperty('designer')
                expect(review).toHaveProperty('owner')
                expect(review).toHaveProperty('review_img_url')
                expect(review).toHaveProperty('review_body')
                expect(review).toHaveProperty('category')
                expect(review).toHaveProperty('created_at')
                expect(review).toHaveProperty('votes')
            })
        })
    })
})