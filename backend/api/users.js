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

module.exports = {
  hashPassword,
	getUser,
}
