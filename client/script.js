import bot from './assets/bot.svg'
import user from './assets/user.svg'
import pkg from 'react-speech-kit'
const {useSpeechSynthesis} = pkg


const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval
let inTypeTest = false
let inSpeekTextCreation = false


window.onload = async (event) => {

    //await new Promise(resolve => setTimeout(resolve, 5000));

    var delayInMilliseconds = 500; //1 second

    const data = new FormData(form)

    let voices = getVoices();
    let rate = 1, pitch = 2, volume = 1;
    let text = "";

    

    // user's chatstripe
    //chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

    // to clear the textarea input 
    form.reset()

    // bot's chatstripe
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div 
    const messageDiv = document.getElementById(uniqueId)

    // messageDiv.innerHTML = "..."
    loader(messageDiv)

    try {
        const response = await fetch('https://uanamaai.onrender.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: 'greet me'
            })
        })

        

        clearInterval(loadInterval)
        messageDiv.innerHTML = " "

        if (response.ok) {
            let data = await response.json();
            const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 

            speak(data.bot, voices[0], rate, pitch, volume);

            typeText(messageDiv, parsedData)
        } else {
            const err = await response.text()

            messageDiv.innerHTML = "Something went wrong"
            alert(err)
        }
    } catch (error) {
        console.error(error);
    }

    /*
    while (inTypeTest) {
        await delay(100);
    }
    */

    /*
    setTimeout(async function() {
        const data = new FormData(form)

        // user's chatstripe
        //chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

        // to clear the textarea input 
        form.reset()

        // bot's chatstripe
        const uniqueId = generateUniqueId()
        chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

        // to focus scroll to the bottom 
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // specific message div 
        const messageDiv = document.getElementById(uniqueId)

        // messageDiv.innerHTML = "..."
        loader(messageDiv)

        try {
            const response = await fetch('https://uanamaai.onrender.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: 'tell me something interesting and funny at the same time'
                })
            })

            

            clearInterval(loadInterval)
            messageDiv.innerHTML = " "

            if (response.ok) {
                const data = await response.json();
                const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 


                typeText(messageDiv, parsedData)
            } else {
                const err = await response.text()

                messageDiv.innerHTML = "Something went wrong"
                alert(err)
            }
        } catch (error) {
            console.error(error);
        }
    }, delayInMilliseconds);
    */
    
}; 

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            inTypeTest = true
            element.innerHTML += text.charAt(index)
            index++
        } else {
            inTypeTest = false
            clearInterval(interval)
        }
    }, 20)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}

const handleSubmit = async (e) => {
    e.preventDefault()

    console.log(e)

    const data = new FormData(form)

    let voices = getVoices();
    let rate = 1, pitch = 2, volume = 1;
    let text = "";

    // user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

    // to clear the textarea input 
    form.reset()

    // bot's chatstripe
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div 
    const messageDiv = document.getElementById(uniqueId)

    // messageDiv.innerHTML = "..."
    loader(messageDiv)

    try {
        const response = await fetch('https://uanamaai.onrender.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: data.get('prompt')
            })
        })

        clearInterval(loadInterval)
        messageDiv.innerHTML = " "

        if (response.ok) {
            const data = await response.json();
            const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 

            speak(data.bot, voices[3], rate, pitch, volume);

            typeText(messageDiv, parsedData)
        } else {
            const err = await response.text()

            messageDiv.innerHTML = "Something went wrong"
            alert(err)
        }
    } catch (error) {
        console.error(error);
    }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})

function speak(text, voice, rate, pitch, volume) {
    // create a SpeechSynthesisUtterance to configure the how text to be spoken 
    let speakData = new SpeechSynthesisUtterance();
    speakData.volume = volume; // From 0 to 1
    speakData.rate = rate; // From 0.1 to 10
    speakData.pitch = pitch; // From 0 to 2
    speakData.text = text;
    speakData.lang = 'it';
    speakData.voice = voice;
    
    // pass the SpeechSynthesisUtterance to speechSynthesis.speak to start speaking 
    speechSynthesis.speak(speakData);
}

function getVoices() {
    let voices = speechSynthesis.getVoices();
    if(!voices.length){
      let utterance = new SpeechSynthesisUtterance("");
      speechSynthesis.speak(utterance);
      voices = speechSynthesis.getVoices();
    }
    return voices;
}