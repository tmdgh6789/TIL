module.exports = function () {
    var route = require('express').Router();
    var conn = require('../../config/mysql/db')();

    route.get('/add', function (req, res) {
        var sql = 'select id, title from topic';
        //noinspection JSUnusedLocalSymbols,JSUnresolvedFunction
        conn.query(sql, function (err, topics, fields) {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            }
            //noinspection JSUnresolvedVariable
            res.render('topic/add', {topics: topics, user:req.user});
        });
    });

    //noinspection JSUnresolvedFunction
    route.post('/add', function (req, res) {
        var title = req.body.title;
        //noinspection JSUnresolvedVariable
        var des = req.body.description;
        //noinspection JSUnresolvedVariable
        var author = req.body.author;
        var sql = 'insert ivnto topic (title, description, author) values(?, ?, ?)';
        //noinspection JSUnusedLocalSymbols,JSUnresolvedFunction
        conn.query(sql, [title, des, author], function (err, result, fields) {
            if(err){
                console.log(err);
                res.status(500).send('Internal Server Error');
            }
            else{
                res.redirect('/topic/'+result.insertId);
            }
        });
    });

    route.get(['/:id/edit'], function (req, res) {
        var sql = 'select id, title from topic';
        //noinspection JSUnusedLocalSymbols,JSUnresolvedFunction
        conn.query(sql, function (err, topics, fields) {
            //noinspection JSUnresolvedVariable
            var id = req.params.id;
            if(id){
                var sql = 'select * from topic where id=?';
                //noinspection JSUnusedLocalSymbols,JSUnresolvedFunction
                conn.query(sql, [id], function (err, topic, fileds) {
                    if(err){
                        console.log(err);
                        res.status(500).send('Internal Server Error');
                    }
                    else {
                        //noinspection JSUnresolvedVariable
                        res.render('topic/edit', {topics: topics, topic: topic[0], user:req.user});
                    }
                });
            }
            else {
                console.log('There is no id');
                res.status(500).send('Internal Server Error');
            }
        });
    });

    //noinspection JSUnresolvedFunction
    route.post(['/:id/edit'], function (req, res) {
        var title = req.body.title;
        //noinspection JSUnresolvedVariable
        var description = req.body.description;
        //noinspection JSUnresolvedVariable
        var author = req.body.author;
        var id = req.params.id;
        var sql = 'update topic set title=?, description=?, author=? where id=?';
        //noinspection JSUnusedLocalSymbols,JSUnresolvedFunction
        conn.query(sql, [title, description, author, id], function (err, result, fields) {
            if(err){
                console.log(err);
                res.status(500).send('Internal Server Error');
            }
            else{
                res.redirect('/topic/'+id);
            }
        });
    });

    route.get('/:id/delete', function (req, res) {
        var sql = 'select id, title from topic';
        //noinspection JSUnusedLocalSymbols,JSUnresolvedFunction
        conn.query(sql, function (err, topics, fields) {
            var sql = 'select * from topic where id=?';
            //noinspection JSUnresolvedVariable
            var id = req.params.id;
            //noinspection JSUnusedLocalSymbols,JSUnresolvedFunction
            conn.query(sql, [id], function (err, topic, fields) {
                if(err){
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                }
                else {
                    if(topic.length === 0) {
                        console.log('There is no record');
                        res.status(500).send('Internal Server Error');
                    }
                    else{
                        //noinspection JSUnresolvedVariable
                        res.render('topic/delete', {topics: topics, topic: topic[0], user:req.user});
                    }
                }
            });
        });
    });

    //noinspection JSUnresolvedFunction
    route.post('/:id/delete', function (req, res) {
        var id = req.params.id;
        var sql = 'delete from topic where id = ?';
        //noinspection JSUnresolvedFunction,JSUnusedLocalSymbols
        conn.query(sql, [id], function (err, result, fields) {
            res.redirect('/topic');
        });
    });

    route.get(['/', '/:id'], function (req, res) {
        var sql = 'select id, title from topic';
        //noinspection JSUnresolvedFunction,JSUnusedLocalSymbols
        conn.query(sql, function (err, topics, fields) {
            //noinspection JSUnresolvedVariable
            var id = req.params.id;
            if(id){
                var sql = 'select * from topic where id=?';
                //noinspection JSUnusedLocalSymbols,JSUnresolvedFunction
                conn.query(sql, [id], function (err, topic, fileds) {
                    if(err){
                        console.log(err);
                        res.status(500).send('Internal Server Error');
                    }
                    else {
                        //noinspection JSUnresolvedVariable
                        res.render('topic/view', {topics: topics, topic: topic[0], user:req.user});
                    }
                });
            }
            else {
                //noinspection JSUnresolvedVariable
                res.render('topic/view', {topics: topics, user:req.user});
            }
        });
    });

    return route;
};