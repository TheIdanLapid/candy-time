var db = 'shop'
var sql = require('mysql')
var con = sql.createConnection({
  host: 'localhost',
  user: 'root',
  database: db
})

var db = 'shop'

con.connect((err)=> {
  if (err) throw err;
  console.log(`connected to ${db}`);
})

module.exports = con
