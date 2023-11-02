import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector("form")
const chatContainer = document.querySelector('#chat_container')

let loadInterval;

function loader(el){
    el.textContent = '';

    loadInterval = setInterval(() => {
        el.textContent += '.'

        if (el.textContent.length > 4){
            el.textContent = ' ' 
        }
    }, 300)
}

function typeText(el, text){
    let index = 0;

    let interval = setInterval(() => {
        if(index < text.length){
            el.innerHTML += text.charAt(index) //charAt is a javascript string method used to retrieve a character at a specific index.
            index++
        } else{
            clearInterval(interval)
        }
    }, 20)
}

function generateUniqueId(){
    const timestamp = Date.now();
    const randomNum = Math.random();
    const hex = randomNum.toString(16)

    return `id-${timestamp}-${hex}`
}

function chatStripe(isAi, value, uniqueId){
    //add to profile class <img src="${isAI ? bot : user}" alt="${isAi ? 'bot' : 'user'}"/>
    return(
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
    e.preventDefault();

    const data = new FormData(form);

    // user's chatstripe 
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

    form.reset();

    //bot chatstripe
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

    chatContainer.scrollTop = chatContainer.scrollHeight;

    const messageDiv = document.getElementById(uniqueId)

    loader(messageDiv)

    const response = await fetch('http://localhost:5000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    clearInterval(loadInterval);
    messageDiv.innerHTML = '';

    if(response.ok){
        const data = await response.json();
        const parsedData = data.bot.trim();

        typeText(messageDiv, parsedData)
    } else{
        const err = await response.text();

        messageDiv.innerHTML="Something went wrong..."
        alert(err)
    }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13){
        handleSubmit(e)
    }
})