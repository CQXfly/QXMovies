var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Movies = require('../model/movie').Movies;
var superagent = require('superagent');
var cheerio = require('cheerio');

var assert = require('assert');
var charset = require('superagent-charset');
var request = charset(superagent);


var allPages = 10;// 爬10页
var index = 0;
var url = "http://www.ygdy8.net/html/gndy/dyzz/";


router.get('/', function(req,res,next){

    // 开始爬虫
    // res.send({"error":"我不爬了啊"});
    //每天爬一次
    spyder(url, 1,function (index) {
        // res.send(index);
    });

    res.send("执行爬虫");

});

router.get('/detail',function (req,res,next) {

    res.send(Movies);
});



var spyder = function (url,index,callback) {
  var list = "list_23_" + index + ".html";
  var allurl = url + list;

    request.get(allurl).charset('gbk').end(function (err,sres) {
        if(!sres.text){return}
      var $ = cheerio.load(sres.text);

      $('.co_content8').find('ul').find('table').each(function(idx,elment){

          console.log('no value');

            var $element = $('element');
//*[@id="header"]/div/div[3]/div[3]/div[2]/div[2]/div[2]/ul/table[1]/tbody/tr[2]/td[2]/b/a
            // var $element.findClosest()

            var a = $(this).find('tr').eq(1).find('td').eq(1).find('b').find('a').text();

            var b = $(this).find('tr').eq(1).find('td').eq(1).find('b').find('a').attr('href');

            var c = $(this).find('tr').eq(2).find('td').eq(1).find('font').text();

            var components = c.split('\r\n');

            var date = components[0];


            var d = $(this).find('tr').eq(3).find('td').eq(0).text();

            var movie = {};
            movie.title = a;
            movie.href = "http://www.ygdy8.net/" + b;
            movie.otherInfo = d;
            movie.date = date;
            movie.webSiteFrom = "电影天堂";


            // 继续去爬最新信息
            SpiderDetail(movie.href,movie,function (movie) {

                // movie存储到数据库
                Movies.createMovieBy(movie);
                // movies.push(movie);


            });

            callback(index);
            // console.log(x);


      });


  })

};

function getItem(item,movie) {
    if (item.match("片　　名")){
        movie.originName = item;
    }
    if(item.match("译　　名")){
            movie.transformName = item;
    }

    if(item.match("年　　代")){
        movie.age = item;
    }
    if(item.match("国　　家")){
        movie.country = item;
    }

    if(item.match("类　　别")){
        movie.filter = item;
    }

    if(item.match("语　　言")){
        movie.language = item;
    }

    if(item.match("字　　幕")){
        movie.subtitle = item;
    }

    if(item.match("IMDb评分")){
        movie.commentScores = item;
    }

    if(item.match("视频尺寸")){
        movie.size = item;
    }


    if (item.match("片　　长")){

        movie.time = item;
    }

    if (item.match("导　　演")){
        movie.director = item;
    }

    if (item.match("主　　演")){
        movie.actors = item;
    }

    if (item.match("简　　介")){
        movie.introduction = item;
    }

}


function SpiderDetail(url,movie,callback) {
    request.get(url).charset('gbk').end(function (err,sres) {

        const  $ = cheerio.load(sres.text);
        $('div[id="Zoom"]').find("span").each(function (idx,el) {
            if (idx != 0) {
                return ;
            }

            $(this).find('img').each(function (idx,el) {

                if (idx == 0) {movie.img = $(this).attr('src')}
                else {
                    movie.allimg = $(this).attr('src')
                }
                var x;


            });

            var z = $(this).text();
            var items = z.split('◎');
            //删除空白
            items.shift();
            items.forEach(function (item) {

                getItem(item,movie)

            });

            callback(movie);
        });

        var x = $('div[id="Zoom"]').find("span").find('table').find('tbody').find('tr').find('td').find('a').text();
        movie.downloadAddress = x;

    });
}

router.spider = function (callback) {
    spyder(url, 1,function (index) {
        callback(index)
    });
};

module.exports = router;
