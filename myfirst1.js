const express = require(`express`);
const bodyParser = require(`body-parser`);
const path = require('node:path');
const fs = require(`node:fs`);
const http = require(`node:http`);
const dt = require('./myfirstmodule');
const url = require('url');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.mongoToken;
const port = process.env.PORT || 8080
global.mtest = 0;
global.uservalue = null;
global.Password = null;
global.loggedin = null;



const application = express();
application.use(bodyParser.json())
application.use(express.static(path.join(__dirname, 'public')));
application.set('view engine' , 'ejs');
application.use(express.urlencoded({ extended: true }));



const client = new MongoClient(uri);
async function run() {
  try {
	const client = new MongoClient(uri);
    const database = client.db('testdata');
    const users = database.collection('test');
    // Queries for a user that has a user value of 'Fruit'
    const query = { user: uservalue['username'] };
    const user = await users.findOne(query);
	console.log(user)
	if (user == null) 
		global.loggedin = false;
		return [loggedin,mtest];
	}
	if (user['password'].toString() == uservalue['password'].toString() && user['user'].toString() == uservalue['username'].toString()) {
		console.log(user['user'].toString());
		console.log(uservalue['username'].toString());
		console.log(user['user'].toString() == uservalue['username'].toString());
		global.mtest = user;
		global.loggedin = true;
		return [loggedin,mtest];
	} else {
		global.loggedin = false;
		return [loggedin,mtest];
		console.log(user['user'].toString());
		console.log(uservalue['username'].toString());
		console.log(user['user'].toString() == uservalue['username'].toString());
	}
  } finally {
    await client.close();
  }
}


application.get(`/`, async(req, res) => {
	// res.sendFile(path.join(path.join(__dirname, `views`), `index.html`))
	res.render('pages/index' , {er:null}); 
	//res.writeHead(200, {'Content-Type': 'text/html'});
	//res.write("The date and time are currently: " + dt.myDateTime());
	//res.write(req.url);
	let q = url.parse(req.url, true).query;
	const txt = q.year + " " + q.month;
	let data = await fs.readFileSync('./views/pages/index.ejs');
	res.write(data);
	res.end(txt);
	
})

application.post('/submit' , async(req , res) => {
	global.uservalue = req.body;
	await run().catch(console.dir);
	if (loggedin == true) {
		res.redirect('/subserver');
	} else if (loggedin == false) {
		res.render('pages/index' , {er:"Username Or password is incorrect"});
	} else {
		return;
	}
	
	
})

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};


application.get('/subserver', async(req,res) => {
	res.render('pages/login', await mtest);
})


let server = http.createServer(application)
server.listen(8080, `0.0.0.0`)