var express = require('express')
var router = express.Router()
var dBase = require('../bin/server-db')
var sqlTemp = require('sql-template-strings')
router.use(express.urlencoded({extended: false}))




//choose time to unregistered shop view
router.get('/nonreg/:time', (req, res) => {
//get products of appropriate time to show in shop


dBase.query(sqlTemp`SELECT * FROM products WHERE future=${req.params.time}`, (err,reso)=>{
  if (err) throw err
  res.render('shop', {
    title: 'Visitor Shop',
    status: 'nonreg',
    opt: req.params.time,
    displays: reso,
    admin: false
  })

})
})
router.get('/members/:id', (req, res)=>{
  var x = req.params.id

  //!!get the active sale amounts in the input fields

  dBase.query(sqlTemp`SELECT * FROM users WHERE userId=${x}`, (err, reso)=>{
    if (err) throw err
    var ult = reso
    dBase.query(sqlTemp`SELECT * FROM products`, (err, ras)=>{
      if (err) throw err
      var q =ras
     res.render('shop', {
       opt: ult[0],
       status:'registered',
       admin: false,
       displays: q,
       title: 'buy some more stuff'
     })
    })
  })
})






module.exports = router
