'use strict';
const express = require('express');
const router = express.Router();

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./taskDB.db', (err) => {
  if (err) {
    db.run("CREATE TABLE taskDB (key INTEGER PRIMARY KEY AUTOINCREMENT, task_title TEXT, creation_date TEXT)");
  }
  console.log('Connected to the in-memory SQlite database.');
});

// db.serialize(function() {
    // db.run("CREATE TABLE taskDB (key INTEGER PRIMARY KEY AUTOINCREMENT, task_title TEXT, creation_date TEXT)");
//     // var stmt = db.prepare("INSERT INTO taskDB (name, date) VALUES (?, ?)");
//     // stmt.run(["Test","03.07.2019"]);
//     // stmt.finalize();
//
//     db.all("SELECT * FROM taskDB", function(err, row) {
//         console.log(row);
//     });
// });
// db.close();


let setData = (req, res, next) => {
  let stmt = db.prepare("INSERT INTO taskDB (task_title, creation_date) VALUES (?, ?)");
  let today = new Date();
  stmt.run([ req.body.taskName.toString(), today.toISOString().substring(0, 10)]);
  stmt.finalize();
  db.all("SELECT * FROM taskDB", function(err, row) {
    res.send({code: 500, data: row});
  });
}
router.post('/setData', setData);

let getdata = (req, res, next) => {
  db.all("SELECT * FROM taskDB", function(err, row) {
    res.send({code: 500, data: row});
  });
};

router.post('/getData', getdata);


module.exports = router;
