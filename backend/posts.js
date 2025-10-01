import multer from 'multer';
import { ObjectId } from 'mongodb';
import { mongoCollection } from './mongo.js';
import { authenticateKey } from './users.js';

const imageUpload = multer({ dest: './public/images' });

async function getReplyTo(post) {
	const { replyTo } = post

	if (!replyTo) return undefined;
	const repliedPost = await mongoCollection('posts')
		.findOne({ '_id': new ObjectId(replyTo) });
	return repliedPost;
}
async function getReplies(post) {
	const { replies: replyIDs } = post;

	if (!replyIDs) return [];
	if (!Array.isArray(replyIDs)) return [];
	if (!replyIDs.length) return [];
  const replies = await mongoCollection('posts')
  	.find({ '_id': { '$in': replyIDs} })
  	.toArray();
	return replies;
}
async function getPost(req, res) {
	const { post: postID } = req.params;
	const post = await mongoCollection('posts')
		.findOne({ '_id': new ObjectId(postID) });

	post.replyTo = await getReplyTo(post);
	post.replies = await getReplies(post);
	res.send(post);
}
async function deletePost(req, res) {
	const { post: postID } = req.params;
	await mongoCollection('posts')
		.deleteOne({ '_id': new ObjectId(postID) });
	res.send('OK');
}

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

async function alterLike(req, res, action) {
	const { post } = req.params;

	const authKey = req.headers.authorization;
	const { userName } = await authenticateKey(authKey);

	const operator = action === 'like' ? '$addToSet' : '$pullAll';
	const operand = action === 'like' ? userName : [userName];
	await mongoCollection('posts')
		.updateOne(
			{ '_id': new ObjectId(post) },
			{ [operator]: { likes: operand } },
		);
}
async function likePost(req, res) { alterLike(req, res, 'like'); }
async function unlikePost(req, res) { alterLike(req, res, 'unlike'); }

async function createPost(req, res) {
  console.log(req.file, req.files, req.body, req.body.images);

	const authKey = req.headers.authorization;
	const {
		userName,
		displayName,
	} = await authenticateKey(authKey);

	if (!userName) {
		res.status(401);
		res.send('Invalid auth key.');
		return;
	}

	const timestamp = Date.now();
	const { text, replyTo, quoteOf } = req.body;
  const images = req.files && req.files.images && Array.isArray(req.files.images)
    ? req.files.images.map((file) => file.filename)
    : [];
	const { insertedId } = await mongoCollection('posts').insertOne({
		userName,
		displayName,
		text,
		replyTo,
		quoteOf,
    images,
		timestamp,
	});
	if (replyTo) {
		await mongoCollection('posts')
			.updateOne(
				{ '_id': new ObjectId(replyTo) },
				{ '$addToSet': { replies: insertedId } },
			);
	}
	if (quoteOf) {
		await mongoCollection('posts')
			.updateOne(
				{ '_id': new ObjectId(quoteOf) },
				{ '$addToSet': { quotes: insertedId } },
			);
	}

	res.status(200).send(insertedId);
}

export default function createEndpoints(app) {
  app.post(
    '/posts',
		imageUpload.fields([{ name: 'images' }]),
    createPost,
  );
  app.get('/posts', async (req, res) => {
		const posts = await getAllPosts();
		res.send(posts);
	});

	app.get('/posts/followed/:userName', getPostsFromFollowed);

	app.get('/posts/:post', getPost);
	app.delete('/posts/:post', deletePost);
	app.put('/posts/:post/like', likePost);
	app.put('/posts/:post/unlike', unlikePost);
}
