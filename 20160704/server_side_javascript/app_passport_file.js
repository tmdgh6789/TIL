var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyparser = require('body-parser');
var bkfd2Password = require("pbkdf2-password");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var hasher = bkfd2Password();

var app = express();
app.use(bodyparser.urlencoded({ extend: false }));

app.use(session({
    secret: '436ahw45#$%Hsd',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));

app.use(passport.initialize());
app.use(passport.session());

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
    req.logout();
    req.session.save(function () {
        res.redirect('/welcome');
    });
});

app.get('/welcome', function (req, res) {
    if(req.user && req.user.displayName){
        res.send(`
            <h1>Hello, ${req.user.displayName}</h1>
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

passport.serializeUser(function(user, done) {
    console.log('serializeUser', user);
    done(null, user.authId);
});

passport.deserializeUser(function(id, done) {
    console.log('deserializeUser ', id);
    for(var i=0; i<users.length; i++) {
        var user = users[i];
        if(user.authId === id){
            return done(null, user);
        }
    }
    done('There is no user');
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        var uname = username;
        var pwd = password;
        for(var i=0; i<users.length; i++) {
            var user = users[i];
            if(uname === user.username) {
                return hasher({password:pwd, salt:user.salt},
                function (err, pass, salt, hash) {
                    if(hash === user.password) {
                        console.log('LocalStrategy', user);
                        done(null, user);
                    }
                    else {
                        done(null, false);
                    }
                });
            }
        }
        done(null, false);
    }
));

passport.use(new FacebookStrategy({
        clientID: '1233324850063790',
        clientSecret: '08b2e5aaf0d876ed35d422074550805c',
        callbackURL: "/auth/facebook/callback",
        profileFields:['id', 'email', 'gender', 'link', 'locale' , 'name', 'timezone', 'updated_time', 'verified', 'displayName']
    },
    function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        var authId = 'facebook:'+profile.id;
        for(var i=0; i<users.length; i++) {
            var user = users[i];
            if (user.authId === authId) {
                return done(null, user);
            }
        }
        var newuser ={
            'authId':authId,
            'displayName': profile.displayName,
            'email':profile.emails[0].value
        };
        users.push(newuser);
        done(null, newuser);
    }
));

app.post('/auth/login', passport.authenticate
    (
        'local',
        {
            successRedirect: '/welcome',
            failureRedirect: '/auth/login',
            failureFlash: false
        }
    )
);

app.get('/auth/facebook', passport.authenticate
    (
        'facebook',
        {scope:'email'}
    )
);

app.get('/auth/facebook/callback',
    passport.authenticate('facebook',
        {
            successRedirect: '/welcome',
            failureRedirect: '/auth/login'
        }
    )
);

var users = [
    {
        authId: 'local:egoing',
        username: 'egoing',
        password: 'xrNrDQjuwUun6HtcQ4dSW0JC8cA7NMtFBsWnLx7WydBPGF6CQgJokrn0rDdzy/rvegZZ5+c+Cj+gxjJ/xF/l6VOtMmw5U+84jI7/inMN6wdZ2jnOlFc4aTWqhCXfz+lESrczb3T/rrIZi6txt7p27DyswFtNdt/Rs3jpO7Js06w=',
        salt:'YDHR2DSJArpQoRzixIenVo60fWBFwGo4zlmXOIRuWAqgAiiDhXEWHYHYTfr3Y3NabgIL7e9nYYACVuO+3zrVpQ==',
        displayName: 'Egoing'
    }
];

app.post('/auth/register', function (req, res) {
    hasher({password:req.body.password}, function (err, pass, salt, hash) {
        var user = {
            authId: 'local:'+req.body.username,
            username: req.body.username,
            password: hash,
            salt: salt,
            displayName: req.body.displayName
        };
        users.push(user);
        req.login(user, function (err) {
            req.session.save(function () {
                res.redirect('/welcome');
            });
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
        <a href="/auth/facebook">facebook</a>
    `;
    res.send(output);
});

app. listen(3003, function () {
    console.log('Connected 3003 port!!!');
});