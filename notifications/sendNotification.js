import { Expo } from 'expo-server-sdk';

const sendNotification = async (expoPushToken, sender, body) => {
    try {
        let expo = new Expo({ accessToken: "8gsdh19Z_EVsugMtQh9o69au20AFJjw3CWwpuP40" });

        if (!Expo.isExpoPushToken(expoPushToken)) return { success: false, message: "Invalid expo token" };
    
        let message = [
            {
                to: expoPushToken, 
                sound: "default",
                body: sender + " said: "  + body,
                channel: "default"
            }
        ];
    
        let chunks = expo.chunkPushNotifications(message);
    
        for (let chunk of chunks) {
            await expo.sendPushNotificationsAsync(chunk);
        };
    
        return { success: true };   
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export default sendNotification;