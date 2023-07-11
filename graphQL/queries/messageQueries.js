import { 
    GraphQLID
} from 'graphql';
import Message from '../../models/messageModel.js';
import MessageType from '../types/MessageType.js';

export const message = {
    type: MessageType,
    args: { id: { type: GraphQLID }},
    resolve (parent, args) {
        return Message.findById(args.id)
    }
};  

export const assignIntent = {
    type: MessageType,
    args: { 
        intentId: { type: GraphQLID },
        messageId: { type: GraphQLID }
    },
    resolve (parent, args) {
        return Message.findByIdAndUpdate(args.messageId, {
            intentId: args.intentId
        })
    }
};