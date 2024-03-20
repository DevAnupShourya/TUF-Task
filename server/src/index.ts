import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
}))

app.get('/ping', (req, res) => {
    res.json({ status: 200, message: 'Namaste Typescript!' });
});

import { CreateSnippet, GetAllSnippets } from './controllers';

// ? Create a Snippet
app.post('/api/snippet', CreateSnippet);
app.get('/api/snippet', GetAllSnippets);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}/`);
});
