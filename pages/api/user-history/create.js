
import dbConnect from '../../../lib/mongodb';
import UserHistory from '@/lib/model/user-history';
import User from '@/lib/model/user';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			await dbConnect();
			const { userId, videoURL, hint, question, aiSummary, feedback, feedbackDescription } = req.body;

			if (!userId || !videoURL || !hint || !question || !aiSummary || feedback === undefined || !feedbackDescription) {
				return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
			}

			const userExists = await User.findById(userId);
			if (!userExists) {
				return res.status(404).json({ error: 'Usuário não encontrado.' });
			}

			// Cria o histórico do usuário
			const newUserHistory = await UserHistory.create({
				userId,
				videoURL,
				hint,
				question,
				aiSummary,
				feedback,
				feedbackDescription,
			});

			res.status(201).json({ message: 'Histórico criado com sucesso!', userHistory: newUserHistory });
		} catch (error) {
			res.status(500).json({ error: 'Erro ao criar histórico.', details: error.message });
		}
	} else {
		res.setHeader('Allow', ['POST']);
		res.status(405).json({ error: `Método ${req.method} não permitido.` });
	}
}
