const express = require('express')
const expect = require('chai').expect
const request = require('supertest')
const app = require('../src/app.ts')

const gbPlanData = {
  id: 1,
  plan_code: 'gb',
  plan_name: 'UK',
  monthly_cost: 10,
  annual_cost: 50
}

describe('GET /api/plans/gb', function() {
  it('returns the gb plan data when passed the "gb" string', async function() {
    const response = await request(app).get('/api/plans/gb')
    expect(response.status).to.eql(200)
    expect(response.body.data).to.eql(gbPlanData)
  })
})
