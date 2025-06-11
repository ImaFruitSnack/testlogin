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
    console.log(user);
	if (user['password'] == uservalue['password']) {
		global.mtest = user;
		console.log("success");
		return mtest;
	} else {
		console.log(user['password']);
		console.log(uservalue['password']);
	}
  } finally {
    await client.close();
  }
}


application.get(`/`, async(req, res) => {
	// res.sendFile(path.join(path.join(__dirname, `views`), `index.html`))
	res.render('pages/index'); 
	//res.writeHead(200, {'Content-Type': 'text/html'});
	//res.write("The date and time are currently: " + dt.myDateTime());
	//res.write(req.url);
	let q = url.parse(req.url, true).query;
	const txt = q.year + " " + q.month;
	let data = await fs.readFileSync('./views/pages/index.ejs');
	res.write(data);
	res.end(txt);
	
})

application.post('/submit' , (req , res) => {
	global.uservalue = req.body;
	console.log("username got " + uservalue['username']);
	console.log("Password got " + uservalue['password']);
	run().catch(console.dir);
	res.redirect('/subserver');
	
	
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
/*
application.listen(8080 , () => {
	console.log("ggs");
})
*/