import express from 'express';
import cors from 'cors';

import mongoConnection from './mongo.js';
import posts from './posts.js';
import users from './users.js';
import images from './images.js';

const app = express()
const port = 8000

app.use(express.static('public'))
app.use(cors())
app.use(express.json())

posts(app);
users(app);
images(app);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, async () => {
	await mongoConnection.connect();
  console.log(`Example app listening on port ${port}`)
})

