var express = require('express')
var router = express.Router()
var multer = require('multer')
var upload = multer({
  dest: 'uploads/'
})
var vladi = require('express-validator')
var dBase = require('../bin/server-db')
router.use(vladi())
var sqlTemp = require('sql-template-strings')
router.use(express.urlencoded({extended: true}))
router.use(express.json())




//visitor wants to register
router.get('/register', (req, res) => {
  res.render('regForm', {
    title: 'Sweet Registration',
    admin:false,
    status:'nonreg'
  })
})


//post regForm
router.post('/register', upload.single('profileImage'), (req, res) => {
//validation
  req.checkBody('email', 'Addresses do not match').equals(req.body.emailc)
  req.checkBody('name', 'No name was typed').notEmpty()
  req.checkBody('email', 'this is not an email').isEmail()
  var rs = req.validationErrors()
//errors with post data
  if (rs) {
    res.render('regForm', {
      title: 'you got problems',
      errors: rs,
      admin:false,
      status:'nonreg'
    })
  }
  //add new user to the database and use his ID to log him in the shop
  var q = sqlTemp `INSERT INTO users (realName, userName, pwd, email) VALUES (${req.body.name}, ${req.body.uname}, ${req.body.pwd}, ${req.body.email})`
  dBase.query(q, (err, result) => {
    if (err) throw err
    res.redirect('/reg-success')
  })
})

// members wants to view cart or has filled an empty one
router.post('/:uid/cart', (req,res)=>{
  var user = req.params.uid
  var x = req.body
  var keys = Object.keys(x)
  var values = Object.values(x)
  var temp = { ids: [], qtys :[]}
    for (var i in keys){
      var sepa = keys[i].split('-')[1]
        if (values[i]>0){
          temp.ids.push(sepa)
          temp.qtys.push(values[i])}
    }
    var gify = JSON.stringify(temp)
//if user doesn't have an active sale (empty cart)
dBase.query(sqlTemp`SELECT * FROM sales WHERE buyer = ${user} AND isActive=TRUE`, (err, res)=>{
  if (err) throw err
  if (res[0]=''){
    dBase.query(sqlTemp`INSERT INTO sales (buyer, details, isActive) VALUES (${user}, ${gify}, TRUE)`, (err, reso)=>{
      if (err) throw err
      res.send(`added ${gify} to DB`)
  })}  else{

      for (var i in temp.ids){
        var posted = temp.ids[i]
        for (var j in res[0].details.ids){
          var already = res[0].details.ids[j]
          if (posted = already)
            dBase.query(sqlTemp`UPDATE sales SET details.qtys[${j}] = ${posted} WHERE saleId = ${res[0].saleId}`, (err, sero)=>{
                if (err) throw err
            })
        }
      }
  }
})
res.redirect(`/users/${user}/cart`)
})

//declare product type
function singleShit(n,p,a){
  this.name = n
  this.price = p
  this.amount = a
}
//decalre global holders for product details
var daHolder = []
//member hit goToCart button
router.get(`/:uid/cart`, (req, res)=>{
  var x = req.params.uid
  var allTheShit = []
//get the active sale details
    dBase.query(sqlTemp`SELECT * FROM sales WHERE buyer =${x} AND isActive=TRUE`, (err, resu)=>{
      if (err) throw err
      var exCart = resu[0]


//get user datails
      dBase.query(sqlTemp`SELECT * FROM users WHERE userId = ${exCart.buyer}`, (err, result)=>{
        if (err) throw err
        var member = result[0]
        var bags = JSON.parse(exCart.details)

//get product details
          for (var i in bags.ids){
            dBase.query(sqlTemp`SELECT * FROM products WHERE prodId = ${bags.ids[i]}`, (err, reso)=>{
              if (err) throw err
              var tempi = new singleShit(reso[0].pName, reso[0].pPrice, bags.qtys[i])
              allTheShit.push(tempi)
              daHolder = allTheShit
          })
        }

      res.render('cart', {
        title: `your cart, senor ${member.userName}`,
        displays:daHolder,
        sale:exCart,
        listings:bags.ids.length,
        admin : false,
        status: 'registered'})
      })
    })

})

module.exports = router
