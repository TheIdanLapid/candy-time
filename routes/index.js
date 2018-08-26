var express = require('express')
var router = express.Router()
router.use(express.urlencoded({extended: false}))
var dBase = require('../bin/server-db')
var sqlTemp = require('sql-template-strings')

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', {
    title: 'Past and Future Sweets',
    status:'nonreg'
  })
})

//login to members shop view
router.post('/login', (req, res)=>{
  console.log(req.body)
  dBase.query(sqlTemp`SELECT * FROM users WHERE email=${req.body.email} AND pwd=${req.body.pwd}`, (err, reso)=>{
    if (err) throw err
    if (JSON.stringify(reso)==='[]') res.redirect('/bad-login')
    else res.redirect(`/shop/members/${reso[0].userId}`)
  })
})


//post registration
router.get('/reg-success', (req, res) => {
  res.render('index', {
    message: 'registration complete. Please Log In'
  })
})

//login failure
router.get('/bad-login', (req, res) => {
  res.render('index', {
    message: 'failed to log in'
  })
})




module.exports = router
