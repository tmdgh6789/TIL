module.exports = function () {

    var express = require('express');
    var session = require('express-session');
    var MySQLStore = require('express-mysql-session')(session);
    //noinspection JSUnusedLocalSymbols,SpellCheckingInspection
    var bodyparser = require('body-parser');

    var app = express();

    app.set('views','./views/mysql');
    app.set('view engine','jade');

    app.use(bodyparser.urlencoded({ extended: false }));

    app.use(session({
        secret: '436ahw45#$%Hsd',
        resave: false,
        saveUninitialized: true,
        store: new MySQLStore({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '123456',
            database: 'o2'
        })
    }));

    return app;
};