const express = require('express')
const expect = require('chai').expect
const request = require('supertest')
const app = require('../src/app.ts')

const allPlanData = [
  {
    id: 1,
    plan_code: 'gb',
    plan_name: 'UK',
    monthly_cost: 10,
    annual_cost: 50
  },
  {
    id: 2,
    plan_code: 'jp',
    plan_name: 'Japan',
    monthly_cost: 15,
    annual_cost: 65
  },
  {
    id: 3,
    plan_code: 'de',
    plan_name: 'Germany',
    monthly_cost: 15,
    annual_cost: 75
  },
  {
    id: 4,
    plan_code: 'us',
    plan_name: 'USA',
    monthly_cost: 25,
    annual_cost: 150
  },
  {
    id: 5,
    plan_code: 'fr',
    plan_name: 'France',
    monthly_cost: 10,
    annual_cost: 60
  }
]

describe('GET /api/plans/:plan_code', function() {
  it('returns the gb plan data when passed "gb" as a plan_code', async function() {
    const response = await request(app).get('/api/plans/gb')
    expect(response.status).to.eql(200)
    expect(response.body.data).to.eql(allPlanData[0])
  })

  // it('returns a 400 error when passed a non existent plan_code', async function() {
  //   const response = await request(app).get('/api/plans/zz')
  //   expect(response.status).to.eql(400)
  // })
})

describe('GET /api/plans', function() {
  it('returns data for all plans', async function() {
    const response = await request(app).get('/api/plans')
    expect(response.status).to.eql(200)
    expect(response.body.data).to.eql(allPlanData)
  })
})

describe('GET /', function() {
  it('returns a 404 error if an invalid route is speified', async function() {
    const response = await request(app).get('/')
    expect(response.status).to.eql(404)
  })
})
