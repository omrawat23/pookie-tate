import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const apikey = process.env.API_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

app.use(cors({
    origin: 'https://pookie-tate.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

app.use(bodyParser.json());

async function say(text) {
    const response = await fetch('https://api.neets.ai/v1/tts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apikey,
        },
        body: JSON.stringify({
            text: text,
            voice_id: 'andrew-tate',
            params: {
                model: 'ar-diff-50k',
            },
        }),
    });
    if (!response.ok) {
        throw new Error(`Error with TTS API: ${response.status} ${response.statusText}`);
    }
    const audioBuffer = await response.buffer();
    return audioBuffer;
}

const INAPPROPRIATE_WORDS = ['bad', 'offensive', 'inappropriate'];
const MAX_MESSAGE_LENGTH = 500;

app.post('/chat', async (req, res) => {
    const { userMessage } = req.body;
    
    if (!userMessage || typeof userMessage !== 'string') {
        return res.status(400).json({ 
            error: 'Invalid input', 
            message: 'User message must be a non-empty string' 
        });
    }

    const cleanedMessage = userMessage
        .trim()
        .replace(/[^\w\s.?!,'-]/gi, '')
        .replace(/\s+/g, ' ')
        .toLowerCase();

    if (cleanedMessage.length > MAX_MESSAGE_LENGTH) {
        return res.status(400).json({ 
            error: 'Message too long', 
            message: `Limit message to ${MAX_MESSAGE_LENGTH} characters` 
        });
    }

    const containsInappropriate = INAPPROPRIATE_WORDS.some(word => 
        cleanedMessage.includes(word)
    );

    if (containsInappropriate) {
        return res.status(400).json({ 
            error: 'Inappropriate content', 
            message: 'Please keep the conversation respectful' 
        });
    }

    try {
        const prompt = JSON.stringify({
            character: "Andrew Tate",
            description: "You are Andrew Tate, known for your strong, confident, and motivational personality. However, in this conversation, you are showing your softer side, offering 'pookie' replies, warm hugs, and comfort to the person you're talking to. You are caring, supportive, and provide reassurance while still maintaining your confidence.",
            message: cleanedMessage
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();

        if (!text) {
            throw new Error('Empty response from AI model');
        }

        const audioBuffer = await say(text);
        const audioBase64 = audioBuffer.toString('base64');

        res.json({ 
            botMessage: text,
            audio: audioBase64
        });

    } catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({ 
            error: 'Internal Server Error', 
            message: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});