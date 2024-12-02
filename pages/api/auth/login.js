import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/lib/db/model/user';
import dbConnect from '@/lib/db/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'DEV';

export default async function handler(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	if (req.method !== 'POST' && req.method !== 'OPTIONS') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	if (req.method == 'OPTIONS') {
		res.status(200).json({ message: 'Yep' });
	}

	try {
		await dbConnect();
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ error: 'Credenciais inválidas.' });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ error: 'Credenciais inválidas.' });
		}

		const token = jwt.sign(
			{ userId: user._id, email: user.email },
			JWT_SECRET,
			{ expiresIn: '10h' }
		);

		res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Erro no servidor.' });
	}
}
