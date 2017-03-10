var express = require('express');
var router = express.Router();
var cors = require('cors');

var mongoose = require('mongoose');
var Movies = require('../model/movie').Movies;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/movies',cors(),function (req,res,next) {
    var size = req.query.size ;
    if (size == undefined){size = 10};
    var index = req.query.index;
    if (index == undefined){index = 0};
    // res.header("Access-Control-Allow-Origin","*");
    // 查询十个数据
    Movies.getMoviesByIndexandSize(index,size,function (docs) {

        // res.append('Access-Control-Allow-Origin','*');
        res.send(JSON.stringify(docs));
    })

});





module.exports = router;
