import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'
import pkg from 'react-speech-kit'
const {useSpeechSynthesis} = pkg

dotenv.config()


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  })
})

app.post('/', async (req, res) => {
  try {
    
    const prompt = req.body.prompt;
    

    console.log(prompt)

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0.7,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    //await new Promise(resolve => setTimeout(resolve, 5000));
    //console.log(response.data.choices[0].text)

    console.log(response.data.choices[0].text)
    let valueToSpeak = "hi how are you?"
    let valueToSpeak1 = new SpeechSynthesisUtterance()

    valueToSpeak1.volume = 1; // From 0 to 1
    valueToSpeak1.rate = 1; // From 0.1 to 10
    valueToSpeak1.pitch = 2; // From 0 to 2
    valueToSpeak1.text = valueToSpeak;
    valueToSpeak1.lang = 'en';
    valueToSpeak1.voice = getVoices()[0];

    speechSynthesis.speak(valueToSpeak1);

    //speak({text:valueToSpeak})

    res.status(200).send({
      bot: response.data.choices[0].text
    });
  } catch (error) {
    //console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

function getVoices() {
  let voices = speechSynthesis.getVoices();
  if(!voices.length){
    let utterance = new SpeechSynthesisUtterance("");
    speechSynthesis.speak(utterance);
    voices = speechSynthesis.getVoices();
  }
  return voices;
}

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))