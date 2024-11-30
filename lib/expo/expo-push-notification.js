// lib/expoPushNotifications.js
import { Expo } from 'expo-server-sdk';

let expo = new Expo();

export const sendPushNotification = async (expoPushToken, message) => {
  const messages = [];
  if (!Expo.isExpoPushToken(expoPushToken)) {
    throw new Error('Token inválido');
  }

  messages.push({
    to: expoPushToken,
    sound: 'default',
    body: message,
    data: { withSome: 'data' },
  });

  try {
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (let chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    return tickets;
  } catch (error) {
    console.error(error);
  }
};
