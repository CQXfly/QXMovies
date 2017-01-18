var express = require('express');
var Redis = require('ioredis');
const redis = new Redis();
var router = express.Router();

var userModel = require('../model/userModel').users;
TopClient = require('../modul/topClient').TopClient;

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});





var client = new TopClient({
    'appkey':'23487745',
    'appsecret':'73e9b9e2b3201fe38d5a70a45814fe2e',
    'REST_URL':'http://gw.api.taobao.com/router/rest'});

router.get('/message',function (req,res,next) {


});

// 获取验证码
router.get('/register',function (req,res,next) {

    const  userphone = req.query.phone;
    const  password = req.query.password;

    if (userphone == null || password == null) { res.send("参数错误") ;return}

    // 应该先查找一次是否注册过

    userModel.loginUserModel(userphone,password,function (doc) {

        if (doc) {

            res.send("已注册")
        } else  {

            const  number = 1234;
            const param = {name:"卧槽 这个验证码碉堡了 ",number:number.toString()};

            // 发送验证马
            const  params = {
                'extend':'123456',
                'sms_type':'normal',
                'sms_free_sign_name':'九日',
                'sms_param':param,
                'rec_num':userphone,
                'sms_template_code':'SMS_30165001'
            };
            client.execute('alibaba.aliqin.fc.sms.num.send ',params
                ,
                function (error,response) {
                    if(!error) {

                        redis.set(userphone,number , 'EX', 60,function (err) {
                            res.send({code:200,message:params})
                        });
                    }
                    else {
                        res.send(error);}
                })

        }


    });


});


router.get('/verifyRegister',function (req,res,next) {
    const  registerMa = req.query.register;
    const  userphone = req.query.phone;
    const  password = req.query.password;

    //从redis中读取刚才输入的key直key为phone
    // userModel.registerUserModel(userphone,password);

    redis.get(userphone,function (err,result) {

        if (result == registerMa){

            userModel.registerUserModel(userphone,password);

            res.send(result)
        } else {
            res.send({error:'超时'})
        }


    })

});

router.get('/login',function (req,res,next) {
    const  userphone = req.query.phone;
    const  password = req.query.password;
    if (userphone == null || password == null) { res.send("参数错误") ;return }
    userModel.loginUserModel(userphone,password,function (doc) {
        if (doc.password == password) {
            res.send('login succefful')
        }

    })
});


router.get('/test',function (req,res,next) {

    console.log(req.query);

    res.render('webb', { title: 'Express' });
});


module.exports = router;
