import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import postRouter from './routes/postRouter';
const app = express();
app.use(cors());
app.use(express.json());
app.use("/", postRouter);
export const api = functions.https.onRequest(app);
