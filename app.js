require('./api/data/db.js')
const express = require('express')
const app = express()
const path = require('path')
const bodyParser=require('body-parser')

const routes = require('./api/routes')

app.set('port', 3000)

app.use((req, res, next)=>{
	console.log(req.method, req.url)
	next()
})
//middleware to respond an static page to GET /. Goes to public, finds index.html and responds to browser
app.use(express.static(path.join(__dirname, 'public'))) 
app.use('/node_modules',express.static(path.join(__dirname, 'node_modules'))) //allows express to access node_modules, hence access angular.js

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use('/api', routes)



const server = app.listen(app.get('port'), () => {
	const port = server.address().port
	console.log('Magic happens on port ' + port)
})




/*app.get('/file', (req, res) => {
	console.log('GET the homepage')
	res
		.status(200)
		.sendFile(path.join(__dirname, 'app.js'))
})*/