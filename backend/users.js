import { createHash } from 'crypto';

import { mongoCollection } from './mongo.js';
import { getPostsFromUser } from './posts.js';

async function createAuthKey(userName) {
	const lastUsed = Date.now();
	const hash = createHash('sha256');
	hash.update(userName);
	hash.update(lastUsed);
	const key = hash.digest('hex');
	await mongoCollection('authKeys')
		.insertOne({
			userName,
			key,
			lastUsed,
		});
	return key;
}

export function hashPassword(password) {
	const hash = createHash('sha256');
	hash.update(password);
	return hash.digest('hex');
}

async function passwordValid(userName, password) {
	console.log(`User ${userName} logging in with password ${password}`);
	if (typeof userName !== 'string') return false;
	if (typeof password !== 'string') return false;
	const hash = hashPassword(password);
	const storedHash = await mongoCollection('users')
		.findOne({ userName })
		.passwordHash;
	return hash === storedHash;
}

async function login(req, res, next) {
	console.log(req.body);
	const { userName, password } = req.body;
	console.log(`User ${userName} logging in with password ${password}`);
	const validPassword = await passwordValid(userName, password);
	if (!validPassword) {
		next(Error('Username/password combination is invalid.'));
  	return;
	}

	const authKey = await createAuthKey(userName);
	console.log(`Login valid, authKey: ${authKey}`);
	res.send(authKey);
}

export async function getUser(userName) {
	const user = await mongoCollection('users').findOne({ userName });
	return { ...user, posts: getPostsFromUser(userName) };
}

async function createUser(req, res, next) {
	const {
		userName,
		displayName,
		email1,
		password1,
	} = req.body;
	const passwordHash = await hashPassword(password1);
	try {
	await mongoCollection('users')
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
		const authKey = await createAuthKey(userName);
		res.send(authKey);
	}
}

export default function createEndpoints(app) {
  app.get('/user/:userName', async (req, res) => {
  	const { userName } = req.params;
  	const user = await getUser(userName);
  	res.send(user);
  });

	app.post('/user/:userName', createUser);
	app.post('/login', login);
}
