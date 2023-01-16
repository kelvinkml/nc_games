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