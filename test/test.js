const express = require('express')
const chai = require('chai')
const request = require('supertest')
const app = require('../src/app.ts')

describe('GET /user', function() {
  it('responds with json', function(done) {
    request(app)
      .get('/api/plans')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200, done)
  })
})
