var express = require('express');
var router = express.Router();
var cors = require('cors');
var crypto = require("crypto");
var request = require('superagent');

var mongoose = require('mongoose');
var Movies = require('../model/movie').Movies;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/movies',cors(),function (req,res,next) {
    var size = req.query.size ;
    if (size == undefined){size = 10}
    var index = req.query.index;
    if (index == undefined){index = 0}
    // res.header("Access-Control-Allow-Origin","*");
    // 查询十个数据
    Movies.getMoviesByIndexandSize(index,size,function (docs) {

        // res.append('Access-Control-Allow-Origin','*');
        res.send(JSON.stringify(docs));
    })

});

router.get('/jpush',function (req,ress,next) {
    var JPush = require("jpush-sdk")
    var client = JPush.buildClient('66d0acad76f3b39b832a7224','972717c0caf284dafd16beed')
    client.push().setPlatform('ios', 'android')
        .setAudience(JPush.registration_id('161a3797c834e6ab330', '171976fa8ab02146239'))
        .setNotification('Hi, JPush', JPush.ios('ios alert','aborigin13.wav',"+1",null,{type:'user',content:'shdjksahdjkasdhkjas'},null,true), JPush.android('android alert', null, 1))
        .setMessage('msg content')
        .setOptions(null, 60,null,false)
        .send(function(err, res) {
            if (err) {
                console.log(err.message)
                ress.send(err)
            } else {
                console.log('Sendno: ' + res.sendno)
                console.log('Msg_id: ' + res.msg_id)
                ress.send(res)
            }
        });
});

router.get('/blockNimAccid',function (req,res,next) {
    const accid = req.query.accid
    const AppKey = '6dae201579a84ba6993559e21dafc11e'
    const Nonce = 'ed481a57a5b6497fa55e04f4c80758e7'
    const CurTime = Date.now().toString()
    let sha1 = crypto.createHash("sha1");

    sha1.update('8359492ae452')
    sha1.update(Nonce)
    sha1.update(CurTime)
    const CheckSum = sha1.digest('hex')

    request.post('https://api.netease.im/nimserver/user/block.action')
        .type('form')
        .set('AppKey',AppKey)
        .set('Accept','application/json')
        .set('Nonce',Nonce)
        .set('CurTime',CurTime)
        .set('CheckSum',CheckSum)
        .send({accid:accid,needkick:'false'})
        .end((error,reslt)=>{
            if (error) {
                res.send(error)
            } else {
                res.send(reslt)
            }
        })

});


router.get('/unblockNimAccid',function (req,res,next) {
    const accid = req.query.accid
    const AppKey = '6dae201579a84ba6993559e21dafc11e'
    const Nonce = 'ed481a57a5b6497fa55e04f4c80758e7'
    const CurTime = Date.now().toString()
    let sha1 = crypto.createHash("sha1");

    sha1.update('8359492ae452')
    sha1.update(Nonce)
    sha1.update(CurTime)
    const CheckSum = sha1.digest('hex')

    request.post('https://api.netease.im/nimserver/user/unblock.action')
        .type('form')
        .set('AppKey',AppKey)
        .set('Accept','application/json')
        .set('Nonce',Nonce)
        .set('CurTime',CurTime)
        .set('CheckSum',CheckSum)
        .send({accid:accid,needkick:'false'})
        .end((error,reslt)=>{
            if (error) {
                res.send(error)
            } else {
                res.send(reslt)
            }
        })

});




module.exports = router;

