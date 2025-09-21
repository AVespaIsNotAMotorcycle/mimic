import { ObjectId } from 'mongodb';
import { mongoCollection } from './mongo.js';

async function getImage(req, res) {
	const { collection, id } = req.params;
  const record = await mongoCollection(`${collection}Images`)
		.findOne({ '_id': new ObjectId(id) });
  res.send(record);
}
async function postImage(req, res) {
	const { collection } = req.params;
  const record = await mongoCollection(`${collection}Images`)
		.insertOne(req.body);
  res.send(record);
}
async function deleteImage(req, res) {
	const { collection, id } = req.params;
  const record = await mongoCollection(`${collection}Images`)
		.deleteOne({ '_id': new ObjectId(id) });
  res.send(record);
}

export default function createEndpoints(app) {
  app.get('/images/:collection/:id', getImage);
  app.post('/images/:collection', postImage);
  app.delete('/images/:collection/:id', deleteImage);
}
