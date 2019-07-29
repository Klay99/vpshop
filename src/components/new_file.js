var express = require('express');
var app = new express();
var mysql = require('mysql');
var multer = require('multer')
var path = require('path');
var bodyParser = require("body-parser");
var fs = require("fs");

//dao 查询orgList
function queryQyxx(callback) {
	var conn = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'root',
		port: '3306',
		database: 'test'
	});
	conn.connect();
	var querySql = 'select * from qyxx';
	conn.query(querySql, function(err, res) {
		if (err) {
			console.log(err.message);
			return;
		}
		callback(res)
	});
	conn.end();
}
//dao 通过企业id查询企业信息
function queryQyxxById(params, callback) {
	console.log('save params:' + params.id);
	var conn = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'root',
		port: '3306',
		database: 'test'
	});
	conn.connect();
	var sql = 'select * from qyxx where id= ?';
	conn.query(sql, [params.id], function(err, res) {
		if (err) {
			console.log(err.message);
			return;
		}
		callback(res)
		// console.log('query result:' + res.affectedRows)
	});
	conn.end();
}
//dao 修改企业信息
function saveQyxx(params, callback) {
	console.log('save params:' + params.id);
	var conn = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'root',
		port: '3306',
		database: 'test'
	});
	conn.connect();
	var sql =
		'update qyxx set qymc=?,xydm=?,frdb=?,gslx=?,xyfz=?,xydj=?,zczj=?,zcdz=?,djjg=?,yyqzi=?,yyqzhi=?,jyfw=?,djzt=?,imgs=?';
	sql += ' where id=?'
	conn.query(sql, [params.qymc, params.xydm, params.frdb, params.gslx, params.xyfz, params.xydj, params.zczj, params.zcdz,
		params.djjg, params.yyqzi, params.yyqzhi, params.jyfw, params.djzt, params.imgs, params.id
	], function(err, res) {
		if (err) {
			console.log(err.message);
			return;
		}
		callback(res)
		console.log('query result:' + res.affectedRows)
	});
	conn.end();
}
//dao 新增企业信息
function addQyxx(params, callback) {
	var conn = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'root',
		port: '3306',
		database: 'test'
	});
	conn.connect();
	var sql =
		'insert into qyxx (qymc,xydm,frdb,gslx,xyfz,xydj,zczj,zcdz,djjg,yyqzi,yyqzhi,jyfw,djzt,imgs)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

	params.imgs=';';
	conn.query(sql, [params.qymc, params.xydm, params.frdb, params.gslx, params.xyfz, params.xydj, params.zczj, params.zcdz,
		params.djjg, params.yyqzi, params.yyqzhi, params.jyfw, params.djzt, params.imgs
	], function(err, res) {
		if (err) {
			console.log(err.message);
			return;
		}
		callback(res)
	});
	conn.end();
}
//dao 删除企业信息
function delQyxx(params, callback) {
	var conn = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'root',
		port: '3306',
		database: 'test'
	});
	conn.connect();
	var sql = 'delete from qyxx where id = ?';

	conn.query(sql, [params.id], function(err, res) {
		if (err) {
			console.log(err.message);
			return;
		}
		callback(res)
	});
	conn.end();
}

//跨域
app.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	res.header('Access-Control-Allow-Methods', '*');

	res.header('Content-Type', 'application/json;charset=utf-8');
	next();

})
//处理前端json
app.use(bodyParser.json({
	limit: '1mb'
}));
app.use(bodyParser.urlencoded({
	extended: true
})); //解析字符
//处理静态资源访问路径
app.use(express.static(path.join(__dirname, 'imgs')))
//controller 查询orgList接口
app.get('/queryQyxx', function(req, res) {
	queryQyxx(function(queryRes) {
		res.json(queryRes);
	});
})
//controller getOrgById
app.post('/queryQyxxById', function(req, res) {
	queryQyxxById(req.body,function(queryRes) {
		res.json(queryRes);
	});
})
//controller 修改企业信息接口
app.post('/saveQyxx', function(req, res) {
	console.log('req body:' + req.body.qymc);
	saveQyxx(req.body, function(queryRes) {
		res.json(queryRes);
	});

})
//controller 添加企业信息接口
app.post('/addQyxx', function(req, res) {
	addQyxx(req.body, function(queryRes) {
		res.json(queryRes);
	});
})
//controller 添加企业信息接口
app.post('/delQyxx', function(req, res) {
	delQyxx(req.body, function(queryRes) {
		res.json(queryRes);
	});

})

// 通过 filename 属性定制
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './imgs/');    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        cb(null, Date.now()+'-' +file.originalname);  
    }
});

// 通过 storage 选项来对 上传行为 进行定制化
// upload = multer({ storage: storage })
var upload = multer({
	storage: storage
});
app.post('/upload', upload.single('logo'), function(req, res, next){
	var file = req.file;

    console.log('文件类型：%s', file.mimetype);
    console.log('原始文件名：%s', file.originalname);
    console.log('文件大小：%s', file.size);
    console.log('文件保存路径：%s', file.path);
	
	var url = 'http://' + req.headers.host  + '/' + file.filename;
    res.send({path: url});
});





app.listen(8888)
