import { mongoCollection } from './mongo.js';
import { authenticateKey } from './users.js';

export async function getAllPosts() {
	const posts = await mongoCollection('posts').find().toArray();
	return posts.reverse();
}
export async function getPostsFromFollowed(req, res) {
	const { userName } = req.params;
	const user = await mongoCollection('users').findOne({ userName });
	const following = user.following ? user.following : [];
	const posts = await mongoCollection('posts').find().toArray();
	const filteredPosts = posts.filter((post) => following.includes(post.userName));
	res.send(filteredPosts);
}
export async function getPostsFromUser(userName) {
	const posts = await mongoCollection('posts').find({ userName }).toArray();
	return posts.reverse();
}

export default function createEndpoints(app) {
  app.get('/posts', async (req, res) => {
		const posts = await getAllPosts();
		res.send(posts);
	});
  app.post('/posts', async (req, res) => {
		const authKey = req.headers.authorization;
		const {
			userName,
			profilePicture,
			displayName,
		} = await authenticateKey(authKey);

		if (!userName) {
			res.status(401);
			res.send('Invalid auth key.');
			return;
		}

		const { text } = req.body;
		await mongoCollection('posts').insertOne({
			userName,
			profilePicture,
			displayName,
			text,
		});

		res.status(200).send('OK');
	});

	app.get('/posts/followed/:userName', getPostsFromFollowed);
}
