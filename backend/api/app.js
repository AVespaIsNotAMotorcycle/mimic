const { MongoClient } = require('mongodb');
const express = require('express')
const cors = require('cors')
const { createHash } = require('crypto');

const app = express()
const port = 8000

const client = new MongoClient(process.env.MIMIC_DB_CONNECTION_STRING);

app.use(cors())

const POSTS = [
		{
			id: '1ged87ft6e',
			userName: 'test_poster',
			displayName: 'John Doe',
			profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Egon_Schiele_-_Self-Portrait_with_Physalis_-_Google_Art_Project.jpg/330px-Egon_Schiele_-_Self-Portrait_with_Physalis_-_Google_Art_Project.jpg',
			text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eu elit ut purus rhoncus finibus. Morbi rhoncus efficitur lorem, vitae placerat mauris tristique consequat.',
		},
		{
			id: '1ged87ft6f',
			userName: 'not_a_real_human',
			displayName: 'Hugh Mann',
			profilePicture: 'https://static01.nyt.com/images/2024/08/06/multimedia/02schiele-qbpl/02schiele-qbpl-superJumbo.jpg',
			text: 'Quisque luctus sem non nisi congue, at blandit est sagittis. Proin sed dignissim erat. Suspendisse potenti. Proin et lacus enim.',
		},
		{
			id: '1ged87ft70',
			userName: 'test_poster',
			displayName: 'John Doe',
			profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Egon_Schiele_-_Self-Portrait_with_Physalis_-_Google_Art_Project.jpg/330px-Egon_Schiele_-_Self-Portrait_with_Physalis_-_Google_Art_Project.jpg',
			text: 'Quisque convallis ipsum non lobortis fringilla. Maecenas varius sollicitudin quam, eu laoreet dolor volutpat vitae. Sed lobortis nibh sit amet metus dignissim interdum. Vivamus a commodo dolor.',
		},
		{
			id: '1ged87ft71',
			userName: 'someones_dog',
			displayName: 'Internet Dog',
			profilePicture: 'https://6.api.artsmia.org/800/10219.jpg',
			text: 'Sed placerat mauris cursus quam facilisis lacinia. Cras porttitor magna blandit tempor commodo. Proin purus augue, fermentum facilisis commodo vel, hendrerit et lacus.',
		},
];

app.get('/posts', (req, res) => {
  res.send(POSTS);
});

function getPostsFromUser(user) {
  return POSTS.filter(({ userName }) => userName === user);
}

function hashPassword(password) {
	const hash = createHash('sha256');
	hash.update(password);
	return hash.digest('hex');
}

app.get('/user/:userName', async (req, res) => {
	const { userName } = req.params;
	const user = await client.db('mimic').collection('users').findOne({ userName });
	res.send({
		...user,
		posts: getPostsFromUser(userName),
	});
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, async () => {
	await client.connect();
  console.log(`Example app listening on port ${port}`)
})

