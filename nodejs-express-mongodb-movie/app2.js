var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var _ = require('underscore')
var Movie = require('./models/movie.js')
var bodyParser = require('body-parser')
var port = process.env.PORT || 3000  // 设置端口号：3000
var app = express()

mongoose.connect('mongodb://localhost/imooc')// 连接mongodb本地数据库imooc

app.set('views','./views/pages') // 设置视图根目录
app.set('view engine','jade') // 设置默认模板引擎：jade
app.use(bodyParser.urlencoded({extended:true})) //bodyParser能够将表单数据进行格式化
// app.use(bodyParser.urlencoded({extended:false}))
// app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')))// 设置路径：public
app.locals.moment = require('moment')// 载入moment模块，格式化日期
app.listen(port)

console.log('nodejs movies started on port ' + port)

// index page
app.get('/',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('index',{
		title: 'imooc 首页',
		movies: movies
		})
	})
})

// detail page
// /:id 表示可以在req.params中拿到id的值
app.get('/movie/:id',function(req,res){
	var id = req.params.id

	Movie.findById(id,function(err,movie){
		res.render('detail',{
		// title: 'imooc 详情页',
		title: 'imooc ' + movie.title,
		movie: movie
		})
	})
})

// admin page
app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title: 'imooc 后台录入页',
		movie: {
			title: '',
			doctor: '',
			country: '',
			year: '',
			poster: '',
			flash: '',
			summary: '',
			language: ''
		  }
	})
})

// admin update movie
app.get('/admin/update/:id',function(req,res){
	var id = req.params.id

	if(id){
		Movie.findById(id,function(err,movie){
			res.render('admin',{
				title:'imooc 后台更新页',
				movie:movie
			})
		})
	}
})

// admin post movie
app.post('/admin/movie/new',function(req,res){
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie
	// 声明_movie变量

	if(id !== 'undefined'){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}

			_movie = _.extend(movie,movieObj) // _.extend用新对象里的字段替换老的字段
			_movie.save(function(err,movie){
				if(err){
					console.log(err)
				}
				res.redirect('/movie/' + movie._id)
			})
		})
	}
	else{
		_movie = new Movie({
			doctor:movieObj.doctor,
			title:movieObj.title,
			country:movieObj.country,
			language:movieObj.language,
			year:movieObj.year,
			poster:movieObj.poster,
			summary:movieObj.summary,
			flash:movieObj.flash
		})

		_movie.save(function(err,movie){
			if(err){
				console.log(err)
			}
			res.redirect('/movie/' + movie._id)
		})
	}
})



// list page
app.get('/admin/list',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('list',{
			title: 'imooc 列表页',
			movies: movies
		})
	})
})

// list delete movie
app.delete('/admin/list',function(req,res){
	var id = req.query.id

	if(id){
		Movie.remove({_id: id},function(err,movie){
			if(err){
				console.log(err)
			}
			else{
				res.json({success: 1})
			}
		})
	}
})
