const express = require('express')
const cors = require('cors')
const { createHash } = require('crypto');

const mongoConnection = require('./mongo');
const posts = require('./posts');
const users = require('./users');

const app = express()
const port = 8000

app.use(cors())
app.use(express.json())

app.get('/posts', (req, res) => { res.send(posts.getAllPosts()); });

function hashPassword(password) {
	const hash = createHash('sha256');
	hash.update(password);
	return hash.digest('hex');
}

users.createEndpoints(app);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, async () => {
	await mongoConnection.connect();
  console.log(`Example app listening on port ${port}`)
})

