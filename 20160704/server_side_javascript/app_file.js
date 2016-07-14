var express = require('express');
var bodyparser = require('body-parser');
var multer = require('multer');
var _storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
var upload = multer({ storage: _storage });
var fs = require('fs');
var app = express();
app.use(bodyparser.urlencoded({ extended: false }));
app.locals.pretty = true;
app.use('/user', express.static('uploads'));
app.set('views','./views_file');
app.set('view engine','jade');
app.get('/upload', function (req, res) {
    res.render('upload');
})
app.post('/upload', upload.single('userfile'), function (req, res) {
    console.log(req.file);
    res.send('Uploaded : '+req.file.filename);
})
app.get('/topic/new', function (req, res) {
    fs.readdir('data', function (err, files) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        res.render('new', {topics: files});
    })
})
app.get(['/topic', '/topic/:id'], function (req, res) {
    fs.readdir('data', function (err, files) {
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        var id = req.params.id;
        if(id) {
            // id값이 있을 때
            fs.readFile('data/' + id, 'utf-8', function (err, data) {
                if (err) {
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                }
                res.render('view', {topics: files, title: id, des: data});
            })
        }
        else {
            // id값이 없을 때
            res.render('view', {topics: files, title: 'Welcome', des: 'Hello, JavaScript for server.'});
        }
    })

})
app.post('/topic', function (req, res) {
    var title = req.body.title;
    var des = req.body.description;
    fs.writeFile('data/'+title, des, function (err) {
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        res.redirect('/topic/'+title);
    })
})
app.listen(5000, function () {
    console.log('Conneting, 5000 port!');
})