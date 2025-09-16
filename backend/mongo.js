import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MIMIC_DB_CONNECTION_STRING);

export function mongoCollection(collectionName) {
  return client.db('mimic').collection(collectionName);
}

export default client;
