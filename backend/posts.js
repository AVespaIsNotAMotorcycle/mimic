import { mongoCollection } from './mongo.js';

export async function getAllPosts() {
	const posts = await mongoCollection('posts').find().toArray();
	return posts;
}
export async function getPostsFromUser(userName) {
	const posts = await mongoCollection('posts').find({ userName }).toArray();
	return posts;
}

export default function createEndpoints(app) {
  app.get('/posts', async (req, res) => {
		const posts = await getAllPosts();
		console.log(posts);
		res.send(posts);
	});
}
