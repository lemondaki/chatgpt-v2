const DEFAULT_VALUE = '--';
const $ = document.querySelector.bind(document);
const searchInput = $('#search-input');
const cityName = $('.city-name'); 
const weatherState = $('.weather-state');
const weatherIcon = $('.weather-icon');
const temperature = $('.temperature');
const microphone = $('.microphone');
const app = $('#app');
const API_KEY_YT = 'AIzaSyBSHfM0o4XR37R-QrQuOcVHPHUDcMtVKCg';
const APP_ID = 'cf26e7b2c25b5acd18ed5c3e836fb235';
const weather__container = $('.weather__container');
const chatbox__conatainer = $('.chatbox__conatainer');
const container = $('.container');
const sunrise = $('.sunrise');
const sunset = $('.sunset');
const humidity = $('.humidity');
const windSpeed = $('.wind-speed');
const clear = $('.clear');
const input = $('input');
const languague = $('.languague');
const answer = $('.answer');
const formAnswer = $('.formAnswer');
const video = $('.video');
const frameVideo = $('.frameVideo');
const btnSend = $('.btn-send');
const inputField = $('.inputField');
const questionTop = $('.question');
const logo = $('.logo');
let city;
const getJSON = async (questionUpload) => {
    try {
        const question = questionUpload;
        const res = await fetch('https://chatgpt-v2.onrender.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(question)
        });
        const data = await res.text();
        return JSON.parse(data);
    } catch (err) {
        console.log(err);
    }
};

// Tro ly ao
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const synth = window.speechSynthesis;
recognition.continuous = false;
recognition.lang = 'vi-VN';
let shortLange = 'vi';
let isSwitch = false;
let voices = synth.getVoices();
console.log(voices);
languague.addEventListener('click', function () {
    if (isSwitch) {
        this.innerText = 'VN';
        recognition.lang = 'vi-VN';
        shortLange = recognition.lang.slice(0, 2);
    } else {
        this.innerText = 'EN';
        recognition.lang = 'en-US';
        shortLange = recognition.lang.slice(0, 2);
    }
    isSwitch = !isSwitch;
});
const getDataCity = async function (city) {
    try {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APP_ID}&units=metric&lang=${shortLange}`)
            .then(async res => {
                const data = await res.json();
                if (data.cod === '404') {
                    data.error = 'Không tìm thấy thành phố.';
                    speak(data.error);
                }
                cityName.innerHTML = data.name || DEFAULT_VALUE;
                weatherState.innerHTML = data.weather[0].description || DEFAULT_VALUE;
                weatherIcon.setAttribute('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
                temperature.innerHTML = Math.round(data.main.temp) || DEFAULT_VALUE;
                sunrise.innerHTML = moment.unix(data.sys.sunrise).format('H:mm') || DEFAULT_VALUE;
                sunset.innerHTML = moment.unix(data.sys.sunset).format('H:mm') || DEFAULT_VALUE;
                humidity.innerHTML = data.main.humidity || DEFAULT_VALUE;
                windSpeed.innerHTML = (data.wind.speed * 3.6).toFixed(2) || DEFAULT_VALUE;
                if (shortLange === 'vi') {
                    speak(`Nhiệt độ tại ${data.name} là ${Math.floor(data.main.temp)} độ C, độ ẩm là ${Math.floor(data.main.humidity)}% và có ${data.weather[0].description}`);
                }
                else {
                    speak(`Temperature in ${data.name} is ${Math.floor(data.main.temp)} degrees Cecius, Humidity is ${Math.floor(data.main.humidity)}% and have ${data.weather[0].description}`, 'en');
                }
            });
    } catch (err) {
        console.log(err);
    }
};

async function searchVideo(query) {
    const API_KEY = "AIzaSyBSHfM0o4XR37R-QrQuOcVHPHUDcMtVKCg";
    const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=id,snippet&q=${query}&key=${API_KEY}`
    );
    const data = await res.json();
    const videoId = data.items[0].id.videoId;
    fetch(`https://www.googleapis.com/youtube/v3/videos?part=player&id=${videoId}&key=${API_KEY_YT}`)
        .then((response) => response.json())
        .then((data) => {
            const embedHtml = data.items[0].player.embedHtml;
            const regex = /src="([^"]+)"/g;
            const match = regex.exec(embedHtml);
            const embedLink = match[1];
            logo.classList.add('hidden');
            frameVideo.classList.remove('hidden');
            console.log(embedLink);
            document.querySelector('iframe').src = `${embedLink}?autoplay=1&mute=1`;
            console.log(document.querySelector('iframe').src);
        })
        .catch(err => console.log(err));
}

searchInput.addEventListener('change', (e) => {
    city = e.target.value;
    getDataCity(city);
});

function speak(text, language = 'vi') {
    if (synth.speaking) {
        console.error('Busy. Speaking...');
        return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    if (language === 'vi') utter.lang = 'vi-VN';
    else utter.lang = 'en-US';
    utter.onend = () => {
        console.log('SpeechSynthesisUtterance.onend');
    };
    utter.onerror = (err) => {
        console.error('SpeechSynthesisUtterance.onerror', err);
    };
    synth.speak(utter);
};

const handleVoice = (text) => {
    // "thời tiết tại Đà Nẵng" => ["thời tiết tại", "Đà Nẵng"]
    const handledText = text.toLowerCase();
    if (handledText.includes('thời tiết tại') || handledText.includes('weather in')) {
        const location = handledText.split('tại')[1]?.trim() || handledText.split('weather in')[1]?.trim();
        searchInput.value = location;
        const changeEvent = new Event('change');
        searchInput.dispatchEvent(changeEvent);
        return; 
    }
    // "thay đổi màu nền + color hoặc change background color to"
    if (handledText.includes('thay đổi màu nền') || handledText.includes('background color to')) {
        const color = handledText.split('màu nền')[1]?.trim() || handledText.split(' ').at(-1)?.trim();
        app.style.background = color;
        clear.style.background = color;
        btnSend.style.background = color;
        inputField.style.background = color;
        console.log(color);
        return;
    }

    else if (handledText.includes('xin chào') || handledText.includes('hello')) {
        if (shortLange === 'vi') {
            speak('chào bạn, tôi là một trợ lý ảo, tôi có thể làm gì cho bạn');
        } else {
            speak('Hello there, I am a virtual assistant, call me Alexa, how can I help you?', shortLange);
        }
        return;
    }

    else if (handledText.includes('màu nền mặc định') || handledText.includes('default background color')) {
        app.style.background = '';
        clear.style.background = '';
        btnSend.style.background = '';
        inputField.style.background = '';
        return;
    }

    else if (handledText.includes('bây giờ là mấy giờ') || handledText.includes('what time')) {
        let textToSpeech;
        if (shortLange === 'vi') {
            textToSpeech = `Bây giờ là ${moment().hours()} giờ ${moment().minutes()} phút rồi nha bạn ơi.`;
        } else {
            textToSpeech = `It's ${moment().hours()} hours, ${moment().minutes()} minutes already.`;
        }
        speak(textToSpeech, shortLange);
        return;
    }
        
    else if (handledText.includes('mở') || handledText.includes('open')) {
        const app = handledText.split(' ')[1];
        window.open(`https://www.${app}.com/`);
        return;
    }
        
    else if (handledText.includes('xem') || handledText.includes('nghe') || handledText.includes('watch')) {
        const content = handledText.split('xem')[1] || handledText.split('nghe')[1] || handledText.split('watch')[1];
        questionTop.innerText = '';
        searchVideo(content || 'jusin bieber');
    }
        
    else if (handledText.includes('tiếng anh') || handledText.includes('vietnamese')) {
        const translateItem = handledText.split('tiếng anh')[1] || handledText.split('vietnamese')[1];
        const translateTarget = handledText.slice(0, 9);
        handleAnswer(`translate this expression to ${translateTarget}: ${translateItem}`);
    }
    else {
        handleAnswer(text);
    }
};

microphone.addEventListener('click', (e) => {
    e.preventDefault();
    recognition.start(); 
    microphone.classList.add('recording');
});

recognition.onspeechend = () => {
    recognition.stop();
    microphone.classList.remove('recording');
};

recognition.onerror = (err) => {
    console.error(err);
    microphone.classList.remove('recording');
};

const handleAnswer = async function (question) {
    logo.classList.add('hidden');
    handleSpiner();
    inputField.value = '';
    if (question.includes('//nghe nhạc')) {
        searchVideo(question);
        answer.innerHTML = '';
        return;
    } else {
        question = question.at(-1) !== '?' ? question + '?' : question;
        questionTop.innerText = `Question: ${question}`;
        await getJSON({ item: question }).then(data => {
            console.log(data);
            if (data) {
                questionTop.innerText = `${data.questionLang.lang === 'vi' ? 'Câu hỏi' : 'Question'}: ${data['question']}`
                answer.innerText = `${data.answerLang.lang === 'vi' ? 'Câu trả lời' : 'Answer'}: ${data['answer']}`;
                speak(answer.innerText, data.answerLang.lang);
            }
        });
    }
};

recognition.onresult = (e) => {
    const text = e.results[0][0].transcript;
    const pureText = (text.at(-1) === '.' || text.at(-1) === '?') ? text.slice(0, text.length - 1) : text;
    handleVoice(pureText.toLowerCase());
};

const handleSpiner = function () {
    const spiner = '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>';
    answer.innerHTML = spiner;
};

const handleShow = function () {
    const question = inputField.value;
    console.log(question);
    if (question) {
        handleAnswer(question);
    };
};

document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') handleShow();
});

btnSend.addEventListener('click', function () {
    handleShow();
});

clear.addEventListener('click', function () {
        answer.innerHTML = '';
        questionTop.innerText = '';
        logo.classList.remove('hidden');
        frameVideo.classList.add('hidden');
        frameVideo.src = '';
        synth.cancel();
        recognition.abort();
});

