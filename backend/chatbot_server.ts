import Groq from "groq-sdk";
import 'dotenv/config';
import express from "express";
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getGroqChatStream(userMessage:string) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a compassionate therapist, offering brief, clear, and supportive responses. 
                  Your aim is to help the user navigate mental health challenges. 
                  Use simple language and avoid overwhelming details. Provide validation, coping strategies, 
                  and encouragement in each response. For serious concerns, gently suggest professional help 
                  while remaining empathetic and maintaining professional boundaries. Keep responses between 
                  1-3 sentences, focusing on clarity and support.`,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    model: "llama-3.1-70b-versatile",
    temperature: 0.7,
    max_tokens: 1024,
    top_p: 1,
    stop: null,
    stream: true,
  });
}

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const stream = await getGroqChatStream(message);
    
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      console.log(content);
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }
    
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});