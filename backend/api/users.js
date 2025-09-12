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

async function createUser() {}

function createEndpoints(app) {
  app.get('/user/:userName', async (req, res) => {
  	const { userName } = req.params;
  	const user = await getUser(userName);
  	res.send(user);
  });

	app.post('/user/:userName', async (req, res, next) => {
		const {
			userName,
			displayName,
			email1,
			password1,
		} = req.body;
		const passwordHash = await hashPassword(password1);
		try {
		const user = await mongoConnection
			.db('mimic')
			.collection('users')
			.insertOne({
				userName,
				displayName,
				email: email1,
				passwordHash,
			});
		} catch (error) {
			if (error.errorResponse.code === 11000) {
				next(Error('Someone already has that username.'));
			} else {
				next(Error('Something went wrong.'));
			}
		} finally {
			res.send('Account successfully created!');
		}
	});
}

module.exports = {
  hashPassword,
	getUser,
  createEndpoints,
}
