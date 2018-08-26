var express  = require('express')
var router = express.Router()
var dBase = require('../bin/server-db')
var sqlTemp = require('sql-template-strings')

router.use(express.urlencoded({extended: false}))


router.get('/', (req,res, comu)=>{
  var tenses = ['past', 'future']
  console.log(comu)
  res.render('admin', {title: 'admin area', times: tenses, admin:true, msg:comu})
})

router.get('/catalog', (req,res)=>{
  dBase.query(sqlTemp`SELECT * FROM products`, (err, reso)=>{
    if (err) throw err
  res.render('catalog', {title: 'products', displays:reso, admin:true})
  })

})

//post new product
router.post('/catalog', (req, res)=>{
  //validation
var bod = req.body
  dBase.query(sqlTemp`INSERT INTO products (pName, future, pImgUrl, pPrice) VALUES (${bod.name}, ${bod.future}, ${bod.image}, ${bod.price});`, (err, reso)=>{
    if(err) throw err
  })
    dBase.query(sqlTemp`SELECT * FROM products WHERE pName=${bod.name} AND pPrice=${bod.price}`, (err, result)=>{
      if (err) throw err
      if (result[0].prodId)
        res.redirect(`/admin/catalog/edit/${result[0].prodId}`)
      else
        res.redirect('/admin', {comu:'bad input'})


  })
})

router.get('/catalog/edit/:pid', (req,res)=>{

  dBase.query(sqlTemp`SELECT * FROM products WHERE prodId=${req.params.pid}`, (err, reso)=>{
    if (err) throw err
    if (reso=[]) res.redirect('/admin', {comu:`products ID ${req.params.pid} doesn't exist`})
    else res.render('product', {title: `editing ${reso[0].pName}`, details: reso[0].pPrice})
  })
})

module.exports =router
