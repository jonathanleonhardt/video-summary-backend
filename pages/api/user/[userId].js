import dbConnect from '@/lib/db/mongodb';
import User from '@/lib/db/model/user';
import mongoose from 'mongoose';

export default async function handler(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	if (req.method !== 'GET' && req.method !== 'OPTIONS') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		await dbConnect();
		const { userId } = req.query;

		if (!userId) {
			return res.status(400).json({ error: 'O ID do usuário é obrigatório.' });
		}

		if (!mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).json({ error: 'O ID do usuário é inválido.' });
		}

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ error: 'Usuário não encontrado.' });
		}

		res.status(200).json({
			id: user._id,
			name: user.name,
			email: user.email,
			createdAt: user.createdAt,
		});
	} catch (error) {
		console.error('Erro ao buscar usuário:', error);
		res.status(500).json({ error: 'Erro interno do servidor' });
	}
}
