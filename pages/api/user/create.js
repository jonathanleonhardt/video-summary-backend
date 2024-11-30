import dbConnect from '../../../lib/db/mongodb';
import User from '@/lib/db/model/user';

export default async function handler(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	if (req.method !== 'POST' && req.method !== 'OPTIONS') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		await dbConnect();
		const { name, email, password } = req.body;
		const newUser = await User.create({ name, email, password });
		res.status(200).json({ message: 'Usuário criado com sucesso!', user: newUser });
	} catch (error) {
		if (error.code === 11000) {
			return res.status(400).json({ error: 'Email já está em uso.' });
		}
		res.status(500).json({ error: 'Erro ao criar usuário.', details: error.message });
	}
}