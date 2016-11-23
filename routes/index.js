var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Movies = require('../model/movie').Movies;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/movies',function (req,res,next) {
    var size = req.query.size ;
    if (size == undefined){size = 10};
    var index = req.query.index;
    if (index == undefined){index = 0};

    // 查询十个数据
    Movies.getMoviesByIndexandSize(index,size,function (docs) {

        res.send(docs);
    })
    
});


module.exports = router;
