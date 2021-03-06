/**
 * Created by chongqingxu on 2016/11/21.
 */
var mongoose = require("mongoose");


var Schema = mongoose.Schema;
var schema = new Schema({
    title: { type: 'string',unique: true},
    transformName: { type: 'string',unique:true },
    img: { type: 'string' },
    allimg: { type: 'string' },
    actor: { type: 'string' },
    age: { type: 'string' },
    country: { type: 'string' },
    date: { type: 'string' },
    director: { type: 'string' },
    filter: { type: 'string' },
    href: { type: 'string' },
    introduction: { type: 'string' },
    language: { type: 'string' },
    otherInfo: { type: 'string' },
    size: { type: 'string' },
    subtitle: { type: 'string' },
    time: { type: 'string' },
    webSiteFrom: { type: 'string' },
    hotCount:{type:'string'}

});

var movies = mongoose.model('movies',schema,'movies');

movies.createMovieBy = function(movie) {

    this.searchMoviesByName(movie.transformName,function (doc) {
        if (doc) { console.log('已经存在了')}
        else {

            movies.create(movie,function (err,doc) {

                if (err){console.log(err.name) } else { }
            })
        }

    });

};

movies.getMoviesDetailById = function(id) {

};

movies.getMoviesByIndexandSize = function(index,size,callback) {

    console.log("sb");
    if (index == 0){
        movies.find().sort({_id:-1}).limit(parseInt(size) ).exec(function (err,docs) {
            if(err){
                console.log(err)
            }
            callback(docs);
        });
    } else {

        var x = index;

        var z = x;
        movies.find({'_id':{'$gt':x}}).limit(parseInt(size)).exec(function (err,docs) {

            callback(docs);
        })
    }
};

movies.searchMoviesByName = function(name,callback) {

    console.log(name);
    movies.findOne({'transformName':name}).exec(function (err,doc) {

        callback(doc)

    })
};

exports.Movies = movies;

