import { GraphQLBoolean, GraphQLID, GraphQLString } from 'graphql';
import IntentType from '../types/IntentType.js';
import Intent from '../../models/intentModel.js';
import Message from '../../models/messageModel.js';
import makeResponseMessage from '../../utilities/response/makeResponseMessage.js';
import User from '../../models/userModel.js';
import errorLogger from '../../logger/errorLogger.js';

export const addIntent = { 
    type: IntentType,
    args: {
        templateId: { type: GraphQLID },
        baseQuestion: { type: GraphQLString },
        messageId: { type: GraphQLID },
        isSpam: { type: GraphQLBoolean }
    },
    async resolve (parent, args) {
        const intent = new Intent({
            templateId: args.templateId,
            baseQuestion: args.baseQuestion,
            isSpam: args.isSpam
        }); 
        
        const newIntent = await intent.save();

        if (args.messageId) {
            await Message.findByIdAndUpdate(args.messageId, {
                intentId: newIntent._id
            });
        };

        return newIntent;
    }
};

//This adds a new message to an intent group
export const assignIntent = {
    type: IntentType,
    args: { 
        intentId: { type: GraphQLID }, 
        messageId: { type: GraphQLID }
    },
    async resolve (parent, args) {
        await Message.findByIdAndUpdate(args.messageId, {
            intentId: args.intentId
        });

        const intent = await Intent.findById(args.intentId);

        const newVolume = intent.volume + 1;

        await Intent.findByIdAndUpdate(args.intentId, {
            volume: newVolume
        });

        const updatedIntent = await Intent.findById(args.intentId);

        return updatedIntent;
    }
};

export const respondToIntent = {
    type: GraphQLBoolean,
    args: { 
        intentId: { type: GraphQLID },
        response: { type: GraphQLString } 
    },
    async resolve (parent, args, context) {
        try {
            await Intent.findByIdAndUpdate(args.intentId, {
                hasResponse: true,
                response: args.response 
            });

            const sender = await User.findById(context.id);
    
            const messages = await Message.find({ $and: [{ intentId: args.intentId, hasResponse: false }]});
    
            for (let i = 0; i < messages.length; i++) {
                if (!messages[i].hasResponse) {
                    await makeResponseMessage(args.response, messages[i].streamId, `${sender.firstName} ${sender.lastName}`);
                }
            }; 

            return true;
        } catch (e) {
            errorLogger.error(e);
            return false;
        }
    }
};