var mysql      = require('mysql');
var conn = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'o2'
});
conn.connect();
/*
var sql = 'select * from topic';
conn.query(sql, function (err, rows, fields) {
    if(err) {
        console.log(err);
    }
    else {
        for(var i=0; i<rows.length; i++){
            console.log(rows[i].author);
        }
    }
})
*/
/*
var sql = 'insert into topic (title, description, author) values(?, ?, ?)';
var params = ['Supervisor', 'Watcher', 'graphittie'];
conn.query(sql, params, function (err, rows, fileds) {
    if(err){
        console.log(err);
    }
    else {
        console.log(rows.insertId);
    }
})
*/
/*
var sql = 'update topic set title=?, description=? where id=?';
var params = ['NPM', 'leezche', 1];
conn.query(sql, params, function (err, rows, fileds) {
    if(err){
        console.log(err);
    }
    else {
        console.log(rows);
    }
})
*/
var sql = 'delete from topic  where id=?';
var params = [1];
conn.query(sql, params, function (err, rows, fileds) {
    if(err){
        console.log(err);
    }
    else {
        console.log(rows);
    }
})
conn.end();