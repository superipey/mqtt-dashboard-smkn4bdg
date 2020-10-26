require('dotenv').config();
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var cors = require('cors');

app.use(cors());

app.get('/get-data', async function (req, res) {
  var page = req.query.page;
  if (page == null) page = 1;

  var search = req.query.search;

  var mysql = require('mysql');
  var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
  });

  connection.connect();
  var sql = '';
  var sqlBasic = "SELECT * FROM node ";
  var sqlCount = "SELECT COUNT(ID) as count FROM node ";

  if (search) {
    console.log(search);
    sql += " WHERE data_1 LIKE '%" + search.value + "%' OR ";
    sql += " data_2 LIKE '%" + search.value + "%' OR ";
    sql += " data_3 LIKE '%" + search.value + "%' OR ";
    sql += " data_4 LIKE '%" + search.value + "%' OR ";
    sql += " data_5 LIKE '%" + search.value + "%' OR ";
    sql += " data_6 LIKE '%" + search.value + "%' OR ";
    sql += " data_7 LIKE '%" + search.value + "%' OR ";
    sql += " data_8 LIKE '%" + search.value + "%' OR ";
    sql += " data_9 LIKE '%" + search.value + "%' OR ";
    sql += " data_10 LIKE '%" + search.value + "%' OR ";
    sql += " lat LIKE '%" + search.value + "%' OR ";
    sql += " lng LIKE '%" + search.value + "%' OR ";
    sql += " device_id LIKE '%" + search.value + "%' OR ";
    sql += " CAST(createdAt as char) LIKE '%" + search.value + "%' ";
  }

  sql += " LIMIT 10 OFFSET " + (10 * page - 1);

  var count = await new Promise(async function (resolve, reject) {
    connection.query(sqlCount, async function (error, results, fields) {
      if (results.length != 0) return resolve(results[0]['count']);
      else return resolve(null);
    });
  });

  var countFiltered = await new Promise(async function (resolve, reject) {
    connection.query(sqlCount + sql, async function (error, results, fields) {
      if (results.length != 0) return resolve(results[0]['count']);
      else return resolve(null);
    });
  });

  connection.query(sqlBasic + sql, function (error, results, fields) {
    if (error) throw error;
    var result = {
      'recordsTotal': count,
      'recordsFiltered': count,
      'data': results,
    }
    return res.json(result);
  });
  connection.end();
});

app.listen(3000);
