'use strict'

var expect = require('chai').expect
var request = require('request')

it('Main page status', function(done) {
  request('http://localhost:8080/api/plans', function(error, response, body) {
    expect(response.statusCode).to.equal(200)
    done()
  })
})