import bcrypt from 'bcryptjs';
import User from '@/lib/db/model/user';
import dbConnect from '@/lib/db/mongodb';

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
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ error: 'E-mail já cadastrado.' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = new User({ name, email, password: hashedPassword });
		await newUser.save();
		console.log(newUser)

		res.status(201).json({ message: 'Usuário registrado com sucesso!' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Erro no servidor.' });
	}
}
