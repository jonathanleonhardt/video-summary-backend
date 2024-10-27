import OpenAI from 'openai';
import ytdl from '@distube/ytdl-core';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';


// Inicialize o OpenAI diretamente sem usar `Configuration`
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { videoUrl } = req.body;
	const { userHint } = req.body;

	try {
		// const audioFilePath = await downloadYoutubeAudio(videoUrl);
		// const transcription = await transcribeAudio(audioFilePath);
		// console.log(transcription);
		// const transcription = "Hey, how's it going? You're on camera. What? Smile. What can I do for you? Give it a 12. I don't know. I'm looking for some weed. Alright, but you're not turning off that camera. I'm looking for some beer."
		const transcription = "Olá a todos! Hoje, quero falar sobre a beleza irresistível dos gatos gordinhos. Esses adoráveis felinos não são apenas fofos, mas também trazem um impacto profundo em nossas vidas. O que os torna tão especiais? Primeiro, a gordura deles é uma forma de amor! Cada pochete é uma prova de que foram bem alimentados e amados. Além disso, seu andar desengonçado e suas carinhas redondas nos fazem sorrir instantaneamente. Estudos mostram que interagir com gatos gordinhos reduz o estresse e a ansiedade, criando um ambiente mais feliz. Então, da próxima vez que você ver um gato gordinho, lembre-se: eles são mais do que fofura; são um lembrete do amor incondicional. Obrigado!";

		const summary = await generateSummary(transcription, userHint);

		res.status(200).json({ summary });
	} catch (error) {
		console.error("Erro ao gerar resumo:", error);
		res.status(500).json({ error: "Erro ao processar vídeo" });
	}
}

async function downloadYoutubeAudio(videoUrl) {
	return new Promise(async (resolve, reject) => {
		try {
			const outputFilePath = path.resolve('/tmp', `audio_${Date.now()}.mp3`);
			const audioStream = ytdl(videoUrl, {
				filter: (format) => format.audioCodec === 'opus' || format.audioCodec === 'mp3',
				quality: 'highestaudio',
			});

			const writeStream = fs.createWriteStream(outputFilePath);
			audioStream.pipe(writeStream);
			writeStream.on('finish', () => resolve(outputFilePath));
			writeStream.on('error', (error) => reject(`Erro ao salvar áudio: ${error.message}`));
		} catch (error) {
			reject(`Erro ao baixar áudio: ${error.message}`);
		}
	});
}

async function transcribeAudio(audioFilePath) {
	console.log("PATH USADO: " + audioFilePath);
	const fileStream = fs.createReadStream(audioFilePath);
	const formData = new FormData();
	formData.append('file', fileStream);
	formData.append('model', 'whisper-1');
	formData.append('language', 'en');

	try {
		const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
			headers: {
				...formData.getHeaders(),
				Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
			},
		});

		return response.data.text;
	} catch (error) {
		if (error.response) {
			console.error('Error data:', error.response.data);
			console.error('Error status:', error.response.status);
		} else {
			console.error('Error message:', error.message);
		}
	}
}

async function generateSummary(transcription, hint) {
	const instructionToIA = `Considerando que voce é um professor respondendo para um aluno e que 
				o texto a seguir é um audio vindo de um video do youtube, explique o que foi apresentado no video
				${hint ? ` em conjunto com a seguinte descrição enviada pelo aluno sobre o video "${hint}", `: ', '},
				não se apresente nem se idenfique como professor apenas haja como tal: ${transcription}`;

	const response = await openai.completions.create({
		model: "gpt-3.5-turbo-instruct",
		prompt: instructionToIA,
		temperature: 0.5,
		max_tokens: 200,
	});

	console.log(response);

	return response.choices[0].text;
}
