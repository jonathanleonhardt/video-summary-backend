import dbConnect from '@/lib/mongodb';
import UserHistory from '@/lib/model/user-history';

export default async function handler(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	if (req.method !== 'GET' && req.method !== 'OPTIONS') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		await dbConnect();
		const { userId } = req.query
		if (!userId) {
			return res.status(400).json({ error: 'O id do usuário é obrigatório.' });
		}
		const userHistories = await UserHistory.find({ userId });

		if (userHistories.length === 0) {	
			return res.status(404).json({ error: 'Historico não encontrado' });
		}

		res.status(200).json({ userHistories });
	} catch (error) {
		console.error('Erro ao buscar histórico:', error);
		res.status(500).json({ error: 'Erro interno do servidor' });
	}
}