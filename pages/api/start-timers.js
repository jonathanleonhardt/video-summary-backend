import scheduleCronJob from '@/lib/tasks/send-notification';

export default async function handler(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	if (req.method !== 'GET' && req.method !== 'OPTIONS') {
		return res.status(405).json({ error: 'Method not allowed' });
	}
	scheduleCronJob();
	res.status(200).json({ message: 'Cron job agendado com sucesso!' });
}
