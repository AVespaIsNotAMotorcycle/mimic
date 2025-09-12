const express = require('express')
const cors = require('cors')
const { createHash } = require('crypto');

const mongoConnection = require('./mongo');
const posts = require('./posts');

const app = express()
const port = 8000

app.use(cors())

app.get('/posts', (req, res) => { res.send(posts.getAllPosts()); });

function hashPassword(password) {
	const hash = createHash('sha256');
	hash.update(password);
	return hash.digest('hex');
}

app.get('/user/:userName', async (req, res) => {
	const { userName } = req.params;
	const user = await mongoConnection.db('mimic').collection('users').findOne({ userName });
	res.send({
		...user,
		posts: posts.getPostsFromUser(userName),
	});
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, async () => {
	await mongoConnection.connect();
  console.log(`Example app listening on port ${port}`)
})

