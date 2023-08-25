import express from "express";
import router from "./src/router/router.js";
import 'dotenv/config';
import ConnectDB from './src/models/connectDB.js';
import bodyParser from 'body-parser'

//! connect db
const db = new ConnectDB();
db.connect()
    .then((res) => {
        console.log('Database connected successfully');
    })
    .catch((err) => console.log(err));
//! app express  
const app = express();
const port = process.env.PORT || 3050;
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());
router(app)

app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
});