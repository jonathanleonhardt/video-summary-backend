import scheduleCronJob from '@/lib/tasks/send-notification';

export default async function handler(req, res) {
	scheduleCronJob();
	res.status(200).json({ message: 'Cron job agendado com sucesso!' });
}
