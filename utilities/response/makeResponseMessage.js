import Message from "../../models/messageModel.js";
import Stream from "../../models/streamModel.js";
import sendNotification from "../../notifications/sendNotification.js";
import User from '../../models/userModel.js';

const makeResponseMessage = async (response, streamId, sentFrom) => { 
    const message = new Message({
        streamId: streamId,
        fromStreamOwner: true,
        content: response, 
        isFile: false,
        timeSent: Date.now()
    });

    await message.save();

    await Message.updateMany({ $and: [{ streamdId: streamId }, { fromStreamOwner: false }]}, { hasResponse: true });

    const stream = await Stream.findById(streamId);
    const subscriber = await User.findById(stream.subscriberId);

    await sendNotification(subscriber.expoToken, sentFrom, response);
};
 
export default makeResponseMessage;