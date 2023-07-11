import { GraphQLBoolean, GraphQLID, GraphQLList, GraphQLString } from 'graphql';
import Message from '../../models/messageModel.js';
import MessageType from '../types/MessageType.js';
import Intent from '../../models/intentModel.js';
import Stream from '../../models/streamModel.js';
import User from '../../models/userModel.js';
import makeResponseMessage from '../../utilities/response/makeResponseMessage.js';
import sendNotification from '../../notifications/sendNotification.js';

export const addMessage = {
    type: MessageType,
    args: {
        streamId: { type: GraphQLID },
        streamOwnerId: { type: GraphQLID },
        streamSubscriberId: { type: GraphQLID },
        fromStreamOwner: { type: GraphQLBoolean }, 
        content: { type: GraphQLString },
        isFile: { type: GraphQLBoolean } 
    },
    async resolve (parent, args) {
        const currentTime = Date.now(); 
        
        const message = new Message({ 
            streamId: args.streamId,
            fromStreamOwner: args.fromStreamOwner,
            content: args.content,
            isFile: false,
            timeSent: currentTime
        });

        if (args.fromStreamOwner) {
            const stream = await Stream.findById(args.streamId);
            await Stream.findByIdAndUpdate(args.streamId, {
                hasUnread: true
            });
            const user = await User.findById(stream.subscriberId);
            const owner = await User.findById(stream.ownerId);
            await sendNotification(user.expoToken, `${owner.firstName} ${owner.lastName}`, args.content);
        };

        return message.save(); 
    }
}; 

export const mergeMessages = { 
    type: MessageType,
    args: {
        messageIdArr: { type: new GraphQLList(GraphQLID)},
    },
    async resolve (parent, args) {
        const firstMessage = await Message.findById(args.messageIdArr[0]._id);

        let newContent = firstMessage.content;

        await Message.findByIdAndDelete(args.messageIdArr[0]._id);

        for (let i = 1; i < args.messageIdArr.length; i++) {
            const messageToAdd = await Message.findById(args.messageIdArr[i]._id);

            newContent = newContent + " " + messageToAdd.content;

            await Message.findByIdAndDelete(args.messageIdArr[i]._id);
        };

        const newMessage = new Message({
            streamId: firstMessage.streamId,
            streamOwnerId: firstMessage.streamOwnerId,
            streamSubscriberId: args.streamSubscriberId,
            fromStreamOwner: false,
            content: newContent,
            isFile: false,
            timeSent: firstMessage.timeSent
        });

        return newMessage.save();
    }
};

export const giveMessageIntent = {
    type: GraphQLBoolean,
    args: {
        intentId: { type: GraphQLID },
        messageId: { type: GraphQLID },
        ownerName: { type: GraphQLString }
    },
    async resolve (parent, args) {
        try { 
            const intent = await Intent.findById(args.intentId);
            const message = await Message.findById(args.messageId); 
    
            if (intent.hasResponse) {
    
                await makeResponseMessage(intent.response, message.streamId, args.ownerName);
    
                await Message.findByIdAndUpdate(args.messageId, {
                    intentId: args.intentId,
                });
            } else {
                await Message.findByIdAndUpdate(args.messageId, {
                    intentId: args.intentId
                }); 
            };
    
            const newVolume = intent.volume + 1;
    
            await Intent.findByIdAndUpdate(args.intentId, {
                volume: newVolume
            });
    
            return true;   
        } catch (error) {
            console.log(error);
            return false;
        }
    }
};