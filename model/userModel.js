/**
 * Created by chongqingxu on 2016/12/4.
 */
var mongoose = require("mongoose");


var Schema = mongoose.Schema;
var schema = new Schema({
    phone:{ type: 'string',unique: true},
    password:{type:'string'},
    userid:{type:'string'}
});

var users = mongoose.model('users',schema,'users');

users.registerUserModel = function (phone,password) {
    var user = {};
    user.phone = phone;
    user.password = password;
    user.userid = '';
    this.create(user,function (err,doc) {

        console.log('register')
    })
};

users.loginUserModel = function (phone,password,callback) {
    this.findOne({'phone':phone}).exec(function (err,doc) {
        if(!err) { callback(doc)}
    })
};

exports.users = users;