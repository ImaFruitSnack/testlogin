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

const application = express();
application.use(bodyParser.json())
application.use(express.static(path.join(__dirname, 'public')));


const client = new MongoClient(uri);
async function run() {
  try {
    const database = client.db('testdata');
    const users = database.collection('test');
    // Queries for a user that has a user value of 'Fruit'
    const query = { user: 'Fruit' };
    const user = await users.findOne(query);
    console.log(user);
	global.mtest = user.toSource();
	return mtest
  } finally {
    await client.close();
  }
}
run().catch(console.dir);


application.get(`/`, async(req, res) => {
	res.sendFile(path.join(path.join(__dirname, `public`), `webfile.html`))
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write("The date and time are currently: " + dt.myDateTime());
	'res.write(req.url);'
	let q = url.parse(req.url, true).query;
	const txt = q.year + " " + q.month + await mtest;
	let data = await fs.readFileSync('./public/webfile.html');
	res.write(data);
	res.end(txt);
})

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

application.get('/subserver', async(req,res) => {
	res.sendFile(path.join(path.join(__dirname, `public`), `webfile2.html`))
})

let server = http.createServer(application)
server.listen(8080, `0.0.0.0`)
