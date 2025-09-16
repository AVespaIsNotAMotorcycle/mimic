import MongoClient from 'mongodb';

const client = new MongoClient(process.env.MIMIC_DB_CONNECTION_STRING);

module.exports = client;
