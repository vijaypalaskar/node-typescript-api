const MONGODB_CONNECTION_URI: any = process.env.MONGODB_CONNECTION_URI;

import { MongoClient }  from 'mongodb';
const client = new MongoClient(MONGODB_CONNECTION_URI);
export let db: any;

export const connect = async () => {
    const conn = await client.connect();
    console.log('successfully connected to database')
    db = conn.db('testdb');
    return client;
};
