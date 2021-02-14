const express = require('express')
const helmet = require('helmet')

const app = express()
var bodyParser = require('body-parser')
var db1 = require('./database.ts')

// middleware
// app.use(helmet())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var port = process.env.PORT || 8080

var router = express.Router()

router.get('/', (req, res, next) => {
  res.json({ message: 'Ok' })
})

router.get('/plans', (req, res, next) => {
  var sql = 'select * from stockpedia_plans'
  var params = []
  db1.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    res.json({
      message: 'success',
      data: rows
    })
  })
})

router.get('/plans/:plan_code', (req, res, next) => {
  var sql = 'select * from stockpedia_plans where plan_code = ?'
  var params = [req.params.plan_code]
  db1.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    res.json({
      message: 'success',
      data: row
    })
  })
})

router.use(function(req, res) {
  res.status(404)
})

app.use('/api', router)

app.listen(port)

console.log('Stockopedia magic happening on port ' + port)

exports = module.exports = app
