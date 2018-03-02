const MongoClient = require('mongodb').MongoClient
const dburl = 'mongodb://localhost:27017/meanhotel'

let _connection = null

const open = function(){
	MongoClient.connect(dburl, (err, db)=>{
		if(err){
			console.log("Db connection has failed")
		} else{
			_connection = db
			console.log("DB connection open", db)
		}
	})
}

const get = function(){
	return _connection
}

module.exports = {
	open,
	get
}
