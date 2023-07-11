import { Router } from 'express';
import { Expo } from 'expo-server-sdk';
import errorLogger from '../logger/errorLogger.js';

const router = Router();

let expo = new Expo({ accessToken: "8gsdh19Z_EVsugMtQh9o69au20AFJjw3CWwpuP40" });

router.post("/sendNotification", async (req, res) => {
    try {
        const receiver = "ExponentPushToken[zOWvDZHj6U6QJpIwG-HbAt]";
        let messages = [];
        if (!Expo.isExpoPushToken(receiver)) {
            console.log("Invalid expo token given"); 
        };

        messages.push({
            to: receiver,
            sound: "default",
            body: "This is a test",
            data: { withSome: 'data' },
            channel: "default"
        });

        let chunks = expo.chunkPushNotifications(messages);

        for (let chunk of chunks) {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        };
        
        res.send({ message: 0 });
    } catch (error) {
        errorLogger.error(error);
        res.send({ message: 1 });
    }
});

export default router;