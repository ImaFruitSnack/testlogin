const express = require(`express`);
const bodyParser = require(`body-parser`);
const path = require('node:path');
const fs = require(`node:fs`);
const http = require(`node:http`);
const dt = require('./myfirstmodule');
const url = require('url');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.mongoToken;

const application = express();
application.use(bodyParser.json())
application.use(express.static(path.join(__dirname, 'public')));

const client = new MongoClient(uri);

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
	await listDatabases(client);
	
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
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
	const txt = q.year + " " + q.month;
	let data = await fs.readFileSync('./public/webfile.html');
	const database = client.db('testdata');
	const colls = database.collection();
	const usercursor = colls.find();
	for await (const user of usercursor) {
		console.log('${user.name}');
	}
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
