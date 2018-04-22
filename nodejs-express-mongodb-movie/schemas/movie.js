var mongoose = require('mongoose')

var MovieSchema = new mongoose.Schema({
	doctor: String,
	title: String,
	language: String,
	country: String,
	summary: String,
	flash: String,
	poster: String,
	year: Number,
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
})

// 模式的pre方法表示每次save操作之前都会先调用这个方法， 判断数据是否新加的
MovieSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}
	else{
		this.meta.updateAt = Date.now()
	}
	next()
})

// 静态方法 ，不会与数据库直接进行交互，只有经过model实例化后才有这方法
// fetch方法取出目前数据库所有的数据
// findById方法用来查询单条数据
MovieSchema.statics = {
	fetch:function(cb){
		return this
		  .find({})
		  .sort('meta.updateAt')
		  .exec(cb)
	},
	findById:function(id,cb){
		return this
		  .findOne({_id:id})
		  .exec(cb)
	}
}

// 将模式导出
module.exports = MovieSchema