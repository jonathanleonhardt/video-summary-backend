import cron from 'node-cron';
import dbConnect from '@/lib/db/mongodb';
import { sendPushNotification } from '@/lib/expo/expo-push-notification';
import UserPushToken from '@/lib/db/model/user-push-token'

const getUserPushTokens = async () => {
	try {
		const userPushTokens = await UserPushToken.find().select('expoToken');
		return userPushTokens.map((tokenDoc) => tokenDoc.expoToken);
	} catch (error) {
		console.error('Erro ao buscar tokens de push:', error);
		throw new Error('Erro ao buscar tokens de push');
	}
}

const sendNotifications = async () => {
	try {
		await dbConnect();
		const userTokens = await getUserPushTokens();

		if (userTokens.length === 0) {
			console.log('Nenhum token encontrado.');
			return;
		}

		for (const token of userTokens) {
			await sendPushNotification(token, 'Sua notificação chegou!');
		}

		console.log('Notificações enviadas com sucesso!');
	} catch (error) {
		console.error('Erro ao enviar notificações:', error);
	}
};

const scheduleCronJob = () => {
	cron.schedule('0 */10 * * *', sendNotifications);
};

export default scheduleCronJob;
