const fetch = require('node-fetch');
require('dotenv').config();
const detect = require('langdetect');
const express = require('express');
const app = express();
const port = 3080; 
const cors = require('cors'); 
app.use(cors());
app.use(express.json());
const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const fecthData = async function (prompt) {
	const res = await fetch(API_ENDPOINT, { 
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			'Authorization': `Bearer ${process.env.API_KEY1}` 
		}, 
		body: JSON.stringify({
			model: "gpt-3.5-turbo",
			messages: [{ "role": "user", "content": `${prompt}`}]
		}),
	})
	const data = await res.json();
	console.log(data);
	console.log(data.choices[0].message.content);
	return data.choices[0].message.content;
}  
app.get('/', async (req, res) => {
	res.send('Welcome back Home Page')
});

app.post('/', async (req, res) => {
	// Lấy dữ liệu text từ yêu cầu POST
	const text = req.body;
	// Xử lý dữ liệu
	const [questionLang] = detect.detect(text.item); // Output: 'vi-VN'
	const answer = await fecthData(text.item);
	console.log(answer);
	const [answerLang] = detect.detect(answer);
 
	// Trả về kết quả cho client
	const response = {
		question: text.item,
		answer, 
		questionLang,
		answerLang
	}
	console.log(response);
	res.send(response);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
