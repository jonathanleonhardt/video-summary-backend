import UserPushToken from "@/lib/db/model/user-push-token";

export default async function handler(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	if (req.method !== 'POST' && req.method !== 'OPTIONS') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const { userId, expoToken } = req.body;
		if (!userId || !expoToken) {
			return res.status(400).json({ error: 'userId e expoToken são obrigatórios.' });
		}

		const existingToken = await UserPushToken.findOne({ userId });
		if (existingToken) {
			existingToken.expoToken = expoToken;
			await existingToken.save();
			return res.status(200).json({ message: 'Token atualizado com sucesso.' });
		}

		const newToken = new UserPushToken({
			userId,
			expoToken,
		});

		await newToken.save();
		res.status(201).json({ message: 'Token registrado com sucesso.' });
	} catch (error) {
		console.error('Erro ao registrar token:', error);
		res.status(500).json({ error: 'Erro interno ao registrar token.' });
	}
}
