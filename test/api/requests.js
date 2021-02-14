'use strict'

const expect = require('chai').expect
const request = require('supertest')
const sinon = require('sinon')

const config = require('../../src/server/core/config')
const User = require('../../src/server/models/User')
const email = require('../../src/server/email')

const endpoint = `http://localhost:${config.get('NODE_PORT_HTTP')}/auth`
const agent = request.agent(endpoint)

const testUserData = require('../data/testUser')

describe('API: /auth/user', function() {
  afterEach(done => {
    User.remove({}, () => {
      done()
    })
  })

  describe('POST /login', () => {
    beforeEach(done => {
      var user = new User(testUserData)
      user.save(() => {
        done()
      })
    })

    it('sets a secure, http-only, 1 year max age cookie if successful', done => {
      agent
        .post('/user/login')
        .send(testUserData)
        .end((err, res) => {
          if (err) done(err)
          const cookie = res.header['set-cookie'][0]
          expect(cookie).to.contain('jwt=')
          expect(cookie).to.contain('Max-Age=31536000')
          expect(cookie).to.contain('HttpOnly; Secure')
          done()
        })
    })

    it('returns the user in the response if successful', done => {
      agent
        .post('/user/login')
        .send(testUserData)
        .end((err, res) => {
          if (err) done(err)
          expect(res.body.data.makername).to.equal(testUserData.makername)
          done()
        })
    })

    it('returns a 401 if unsuccessful', done => {
      agent
        .post('/user/login')
        .send({
          makername: 'not',
          password: 'a user'
        })
        .end((err, res) => {
          if (err) done(err)
          expect(res.statusCode).to.equal(401)
          done()
        })
    })
  })

  describe('POST /register', () => {
    it('sets a secure, http-only, 1 year max age cookie if successful', done => {
      agent
        .post('/user/register')
        .send(testUserData)
        .end((err, res) => {
          if (err) done(err)
          const cookie = res.header['set-cookie'][0]
          expect(cookie).to.contain('jwt=')
          expect(cookie).to.contain('Max-Age=31536000')
          expect(cookie).to.contain('HttpOnly; Secure')
          done()
        })
    })

    it('returns the user in the response if successful', done => {
      agent
        .post('/user/register')
        .send(testUserData)
        .end((err, res) => {
          if (err) done(err)
          expect(res.body.data.makername).to.equal(testUserData.makername)
          done()
        })
    })

    it('returns an error if the given user fails validation', done => {
      agent
        .post('/user/register')
        .send({
          makername: 'with no password'
        })
        .end((err, res) => {
          if (err) done(err)
          expect(res.body.status).to.equal('error')
          expect(res.body.data.password).to.equal('required')
          done()
        })
    })
  })

  describe('POST /requestPasswordReset', () => {
    describe('No account exists with email', () => {
      it('returns a 200', done => {
        agent
          .post('/user/requestPasswordReset')
          .send({
            email: 'user@email.com'
          })
          .end((err, res) => {
            if (err) done(err)
            expect(res.body.status).to.equal('ok')
            done()
          })
      })

      it('calls sendPasswordResetAccountNotFound with the email address', done => {
        const transactionalSpy = sinon.spy(
          email.transactional,
          'sendPasswordResetAccountNotFound'
        )

        agent
          .post('/user/requestPasswordReset')
          .send({
            email: 'user@email.com'
          })
          .end(err => {
            if (err) done(err)
            expect(transactionalSpy.firstCall.args[0]).to.equal(
              'user@email.com'
            )
            transactionalSpy.restore()
            done()
          })
      })
    })

    describe('Account exists with email', () => {
      beforeEach(done => {
        var user = new User(testUserData)
        user.save(() => {
          done()
        })
      })

      it('returns a 200 if the email is associated with an account', done => {
        agent
          .post('/user/requestPasswordReset')
          .send({
            email: testUserData.email
          })
          .end((err, res) => {
            if (err) done(err)
            expect(res.body.status).to.equal('ok')
            done()
          })
      })
    })
  })
})
