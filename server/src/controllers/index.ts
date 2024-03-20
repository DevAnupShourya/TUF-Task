import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import Joi from 'joi';
import Redis from "ioredis";

const redisUri = process.env.REDIS_URI;
const redis = new Redis(redisUri);

const prisma = new PrismaClient({ errorFormat: 'minimal' });

const SnippetSchema = Joi.object({
    username: Joi.string().required().min(2).max(55),
    language_name: Joi.string().required(),
    judge0_token: Joi.string().required(),
    language_code: Joi.number().required(),
    stdin: Joi.string().allow(''),
    source_code: Joi.string().required(),
})

const cachePrefix = "snippets-pages";

async function getFromCache() {
    const cachedData = await redis.get(`${cachePrefix}`);
    return cachedData ? JSON.parse(cachedData) : null;
}

async function setToCache(data: { status: number; message: string; snippets: { id: number; username: string; language_code: number; language_name: string; judge0_token: string; stdin: string; source_code: string; timestamp: Date; }[]; }) {
    await redis.set(`${cachePrefix}`, JSON.stringify(data));
}

export const CreateSnippet = async (req: Request, res: Response) => {
    try {
        const freshData = await SnippetSchema.validateAsync(req.body);
        const createdSnippet = await prisma.snippet.create({
            data: {
                username: freshData.username,
                language_name: freshData.language_name,
                language_code: freshData.language_code,
                judge0_token: freshData.judge0_token,
                stdin: freshData.stdin,
                source_code: freshData.source_code,
            },
        });

        // deleting all cached pages
        await redis.del(`${cachePrefix}`);
        res.json({ status: 202, message: 'Snippet created successfully', id: createdSnippet.id });
    } catch (error: any) {
        console.error('Error While Creating Snippet :', error);
        res.json({ status: 500, message: error.message, data: null });
    } finally {
        await prisma.$disconnect();
    }
};

export const GetAllSnippets = async (req: Request, res: Response) => {
    try {
        // Checking cache first
        const cachedData = await getFromCache();
        if (cachedData) {
            return res.json(cachedData);
        }

        const allData = await prisma.snippet.findMany({});
        const response = {
            status: 200,
            message: "All Snippets",
            snippets: allData
        };

        // saving the cache then sending back to user
        await setToCache(response);
        res.json(response);
    } catch (error: any) {
        console.error(error);
        res.json({ status: 500, message: error.message, data: null });
    } finally {
        await prisma.$disconnect();
    }
};