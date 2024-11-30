import dbConnect from '../../../../lib/db/mongodb';
import UserHistory from '@/lib/db/model/user-history';

export default async function handler(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	if (req.method !== 'PATCH' && req.method !== 'OPTIONS') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		await dbConnect();
		const { id } = req.query
		if (!id) {
			return res.status(400).json({ error: 'O id do usuário é obrigatório.' });
		}

		const updateData = req.body;
		if (!updateData || Object.keys(updateData).length === 0) {
			return res.status(400).json({ error: 'Dados para atualização não fornecidos.' });
		}

		const updatedHistory = await UserHistory.findByIdAndUpdate(id, updateData, {
			new: true,
			runValidators: true,
		});

		if (!updatedHistory) {
			return res.status(404).json({ error: 'Histórico do usuário não encontrado.' });
		}

		res.status(200).json({ updatedHistory });
	} catch (error) {
		console.error('Erro ao buscar histórico:', error);
		res.status(500).json({ error: 'Erro interno do servidor' });
	}
}