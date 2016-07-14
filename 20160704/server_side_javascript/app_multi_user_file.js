var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyparser = require('body-parser');
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();

var app = express();
app.use(bodyparser.urlencoded({ extend: false }));

app.use(session({
    secret: '436ahw45#$%Hsd',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));

app.get('/count', function (req, res) {
    if(req.session.count) {
        req.session.count++;
    }
    else {
        req.session.count = 1;
    }
    res.send('count : '+req.session.count);
});

app.get('/tmp', function (req, res) {
    res. send('result: ' + req.session.count);
});

app.get('/auth/logout', function (req, res) {
    delete req.session.displayName;
    req.session.save(function () {
        res.redirect('/welcome');
    });
});

app.get('/welcome', function (req, res) {
    if(req.session.displayName){
        res.send(`
            <h1>Hello, ${req.session.displayName}</h1>
            <a href="/auth/logout">Logout</a>
        `);
    }
    else {
        res.send(`
            <h1>Welcome</h1>
            <ul>
                <li><a href="/auth/login">Login</a></li>
                <li><a href="/auth/register">Register</a></li>
            </ul>
        `);
    }
});

app.post('/auth/login', function (req, res) {
    var uname = req.body.username;
    var pwd = req.body.password;
    for(var i=0; i<users.length; i++) {
        var user = users[i];
        if(uname === user.username) {
            return hasher({password:pwd, salt:user.salt}, function (err, pass, salt, hash) {
                if(hash === user.password) {
                   req.session.displayName = user.displayName;
                    req.session.save(function () {
                        res.redirect('/welcome');
                    });
                }
                else {
                    res.send('who are you? <a href="/auth/login">login</a>');
                }
            });
        }
    }
    res.send('who are you? <a href="/auth/login">login</a>');
});
var users = [
    {
        username: 'egoing',
        password: 'xrNrDQjuwUun6HtcQ4dSW0JC8cA7NMtFBsWnLx7WydBPGF6CQgJokrn0rDdzy/rvegZZ5+c+Cj+gxjJ/xF/l6VOtMmw5U+84jI7/inMN6wdZ2jnOlFc4aTWqhCXfz+lESrczb3T/rrIZi6txt7p27DyswFtNdt/Rs3jpO7Js06w=',
        salt:'YDHR2DSJArpQoRzixIenVo60fWBFwGo4zlmXOIRuWAqgAiiDhXEWHYHYTfr3Y3NabgIL7e9nYYACVuO+3zrVpQ==',
        displayName: 'Egoing'
    }
];

app.post('/auth/register', function (req, res) {
    hasher({password:req.body.password}, function (err, pass, salt, hash) {
        var user = {
            username: req.body.username,
            password: hash,
            salt: salt,
            displayName: req.body.displayName
        };
        users.push(user);
        req.session.displayName = req.body.displayName;
        req.session.save(function () {
            res.redirect('/welcome');
        });
    });
});

app.get('/auth/register', function (req, res) {
    var output =`
     <h1>Register</h1>
        <form action="/auth/register" method="post">
            <p>
                <input type="text" name="username" placeholder="username">
            </p>
            <p>
                <input type="password" name="password" placeholder="password">
            </p>
            <p>
                <input type="text" name="displayName" placeholder="displayName">
            </p>
            <p>
                <input type="submit">
            </p>
        </form>
    `;
    res.send(output);
});

app.get('/auth/login', function (req, res) {
    var output =`
     <h1>Login</h1>
        <form action="/auth/login" method="post">
            <p>
                <input type="text" name="username" placeholder="username">
            </p>
            <p>
                <input type="password" name="password" placeholder="password">
            </p>
            <p>
                <input type="submit">
            </p>
        </form>
    `;
    res.send(output);
});

app. listen(3003, function () {
    console.log('Connected 3003 port!!!');
});