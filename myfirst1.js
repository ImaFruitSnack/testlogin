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

const application = express();
application.use(bodyParser.json())
application.use(express.static(path.join(__dirname, 'public')));


const client = new MongoClient(uri);
async function run() {
  try {
    const database = client.db('sample_mflix');
    const movies = database.collection('movies');
    // Queries for a movie that has a title value of 'Back to the Future'
    const query = { title: 'Back to the Future' };
    const movie = await movies.findOne(query);
    console.log(movie);
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
	const txt = q.year + " " + q.month;
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
