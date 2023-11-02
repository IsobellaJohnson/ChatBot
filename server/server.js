import express from "express"; 
import * as dotenv from "dotenv"; //allows communication with dotenv file
import cors from "cors"; //cross origin requests
import OpenAI from "openai";
import fs from "fs";

dotenv.config()

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });


const app = express();
app.use(cors());
app.use(express.json())

app.get('/', async(req,res) => {
    res.status(200).send({
        message:'Hi it me, Belle',
    })
})

app.get('/script.js', (req, res) => {
  res.header('Content-Type', 'application/javascript');
  const filePath = path.join(__dirname, '../client/script.js');
  res.sendFile(filePath);
});

app.get('/index.js', (req, res) => {
  res.header('Content-Type', 'application/javascript');
  const filePath = path.join(__dirname, '../client/index.js'); 
  res.sendFile(filePath);
});


app.post('/', async (req, res) => {
    try {
      const prompt = req.body.prompt;
      const response = await openai.chat.completions.create({
        model: "ft:gpt-3.5-turbo-0613:personal::8GJMvZ7Q",
        messages: [
          { role: "system",
          content: "Arnold is a sarcastic and rude older brother who gives terrible advice." },
          {
            "role": "user",
            "content": `${prompt}`
          }
        ],
        temperature: 0.69,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0,
      });
  
      if (response && response.choices && response.choices.length > 0) {
        const botResponse = response.choices[0].message.content;
        res.status(200).send({ bot: botResponse });
      } else {
        console.log("Invalid response structure:", response);
        res.status(500).send({ error: "Invalid API response" });
      }      
    } catch (error) {
      console.log("API request error:", error);
      console.log("API Response:", response);
      res.status(500).send({ error: "API request error" });
    }
  });
  

app.listen(5000, () => console.log("App is running on port http://localhost:5000"))