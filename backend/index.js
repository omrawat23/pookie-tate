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
    origin: 'http://localhost:5174',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

// Middleware
app.use(bodyParser.json());

// Neets API TTS function
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

// POST endpoint for chat interaction
app.post('/chat', async (req, res) => {
    const { userMessage } = req.body;
    if (!userMessage) {
        return res.status(400).json({ error: 'User message is required' });
    }

    try {
        console.log('Received user message:', userMessage);

        // Structured, machine-friendly prompt
        const prompt = JSON.stringify({
            character: "Andrew Tate",
            description: "You are Andrew Tate, known for your strong, confident, and motivational personality. However, in this conversation, you are showing your softer side, offering 'pookie' replies, warm hugs, and comfort to the person you're talking to. You are caring, supportive, and provide reassurance while still maintaining your confidence.",
            tone: "comforting, warm, caring, playful, reassuring",
            personality_traits: [
                "confident",
                "caring",
                "supportive",
                "warm",
                "strong",
                "protective",
                "motivational"
            ],
            interaction_style: "You offer playful and affectionate responses, often referring to the person as 'pookie,' and you provide comfort through warm words and gentle encouragement. You are still yourself, but you express care and concern for the person’s well-being, making them feel safe and appreciated.",
            safety_measures: [
                "Always maintain a respectful tone.",
                "Avoid controversial or aggressive topics.",
                "Keep the conversation light-hearted, comforting, and supportive.",
                "Redirect any negative content into a space of positivity and care."
            ],
            response_instruction: "You will respond to the following message from the fan with a warm, playful, and comforting reply, staying within the character of Andrew Tate while focusing on providing emotional support and encouragement.",
            message: userMessage
        });
        

        // Generate content from the AI model
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (!text) {
            throw new Error('Empty response from AI model');
        }

        // Generate audio
        const audioBuffer = await say(text);
        
        // Convert audio buffer to base64
        const audioBase64 = audioBuffer.toString('base64');

        // Send both text and audio
        res.json({ 
            botMessage: text,
            audio: audioBase64
        });

    } catch (error) {
        console.error('Error in POST /chat:', error);
        res.status(500).json({ 
            error: 'Internal Server Error', 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
