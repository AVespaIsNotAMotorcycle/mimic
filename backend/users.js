import { createHash } from 'crypto';

import { mongoCollection } from './mongo.js';
import { getPostsFromUser } from './posts.js';

export async function authenticateKey(authKey) {
  const record = await mongoCollection('authKeys')
		.findOne({ authKey });
  if (!record) return null;

	const { lastUsed } = record;
	const ONE_DAY = 1000 * 60 * 60 * 24;
	const timestamp = Date.now();
	if (timestamp - lastUsed > ONE_DAY) return null;

	const { userName } = record;
	const user = await mongoCollection('users')
		.findOne({ userName });
	return user;
}

async function createAuthKey(userName) {
	const lastUsed = Date.now();
	const hash = createHash('sha256');
	hash.update(userName);
	hash.update(lastUsed.toString());
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
	const digest = hash.digest('hex');
  return digest;
}

async function passwordValid(userName, password) {
	const hash = hashPassword(password);
	const userRecord = await mongoCollection('users').findOne({ userName });
	return hash === userRecord.passwordHash;
}

async function login(req, res, next) {
	const { userName, password } = req.body;
	const validPassword = await passwordValid(userName, password);
	if (!validPassword) {
		next(Error('Username/password combination is invalid.'));
  	return;
	}

	const authKey = await createAuthKey(userName);
	res.send(authKey);
}

export async function getUser(userName) {
	const user = await mongoCollection('users').findOne({ userName });
	const posts = await getPostsFromUser(userName);
	return { ...user, posts };
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
		const authKey = await createAuthKey(userName);
		res.send(authKey);
	} catch (error) {
		if (error.errorResponse.code === 11000) {
			const message = 'Someone already has that username.';
			res.status(409).send(message);
		} else {
			next(error);
		}
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
