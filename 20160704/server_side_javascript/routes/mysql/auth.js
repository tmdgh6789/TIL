module.exports = function (passport) {

    var pbkdf2Password = require("pbkdf2-password");
    var hasher = pbkdf2Password();

    var conn = require('../../config/mysql/db')();
    var route = require('express').Router();

    //noinspection JSUnresolvedFunction
    route.post('/login', passport.authenticate
        (
            'local',
            {
                successRedirect: '/topic',
                failureRedirect: '/auth/login',
                failureFlash: false
            }
        )
    );

    route.get('/facebook', passport.authenticate
        (
            'facebook',
            {scope:'email'}
        )
    );

    route.get('/facebook/callback',
        passport.authenticate('facebook',
            {
                successRedirect: '/topic',
                failureRedirect: '/auth/login'
            }
        )
    );

    //noinspection JSUnresolvedFunction
    route.post('/register', function (req, res) {
        hasher({password:req.body.password}, function (err, pass, salt, hash) {
            var user = {
                authId: 'local:'+req.body.username,
                username: req.body.username,
                password: hash,
                salt: salt,
                displayName: req.body.displayName
            };
            var sql = 'insert into users set ?';
            //noinspection JSUnusedLocalSymbols,JSUnresolvedFunction
            conn.query(sql, user, function (err, results) {
                if(err){
                    console.log(err);
                    res.status(500);
                }
                else {
                    //noinspection JSUnusedLocalSymbols
                    req.login(user, function (err) {
                        req.session.save(function () {
                            res.redirect('/topic');
                        });
                    });
                }
            });
        });
    });

    route.get('/register', function (req, res) {
        var sql = 'select id, title from topic';
        //noinspection JSUnresolvedFunction,JSUnusedLocalSymbols
        conn.query(sql, function (err, topics, fields) {
            res.render('auth/register', {topics: topics});
        });
    });

    route.get('/login', function (req, res) {
        var sql = 'select id, title from topic';
        //noinspection JSUnresolvedFunction,JSUnusedLocalSymbols
        conn.query(sql, function (err, topics, fields) {
            res.render('auth/login', {topics: topics});
        });
    });

    route.get('/logout', function (req, res) {
        //noinspection JSUnresolvedFunction
        req.logout();
        //noinspection JSUnresolvedVariable
        req.session.save(function () {
            res.redirect('/topic');
        });
    });

    return route;
};