const { createHash } = require('crypto');

const mongoConnection = require('./mongo');
const posts = require('./posts');

function hashPassword(password) {
	const hash = createHash('sha256');
	hash.update(password);
	return hash.digest('hex');
}

async function getUser(userName) {
	const user = await mongoConnection.db('mimic').collection('users').findOne({ userName });
	return { ...user, posts: posts.getPostsFromUser(userName) };
}

function createEndpoints(app) {
  app.get('/user/:userName', async (req, res) => {
  	const { userName } = req.params;
  	const user = await users.getUser(userName);
  	res.send(user);
  });
}

module.exports = {
  hashPassword,
	getUser,
  createEndpoints,
}
