import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import * as bodyParser from 'body-parser';
import cors  from 'cors';
import {connect} from './db';
const app = express();
const PORT = process.env.PORT;
import routes  from "./Hotel";
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
    res.json({ message: 'hello from server!' })
});

app.use('/api/hotel', routes);

app.listen(PORT, () => {
    connect();
    console.log(`server listening on PORT: ${PORT}`);
});
