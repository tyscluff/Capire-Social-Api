import { GraphQLID, GraphQLInt, GraphQLString, GraphQLBoolean } from 'graphql';
import Template from '../../models/templateModel.js';
import TemplateType from '../types/TemplateType.js';
import Stream from '../../models/streamModel.js';
import Message from '../../models/messageModel.js';
import User from '../../models/userModel.js';
import sendNotification from '../../notifications/sendNotification.js';
import errorLogger from '../../logger/errorLogger.js';

export const addTemplate = {
    type: TemplateType,
    args: {
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLInt },
        contactEmail: { type: GraphQLString }
    },
    resolve (parent, args, context) {
        const template = new Template({
            title: args.title,
            description: args.description,
            ownerId: context.id,
            price: args.price ? args.price : 0,
            contactEmail: args.contactEmail,
            approved: false
        }); 

        return template.save();
    }
};

export const messageTemplate = {
    type: GraphQLBoolean, 
    args: {
        templateId: { type: GraphQLID },
        content: { type: GraphQLString }
    },
    async resolve (parent, args) {
        try {
            const template = await Template.findById(args.templateId);

            const templateOwner = await User.findById(template.ownerId);

            const streams = await Stream.find({ templateId: args.templateId });

            const currentTime = Date.now();
    
            for (let i = 0; i < streams.length; i++) {

                const subscriber = await User.findById(streams[i].subscriberId);

                const message = new Message({
                    streamId: streams[i]._id,
                    content: args.content,
                    fromStreamOwner: true,
                    timeSent: currentTime,
                    isBlast: true
                });

                await sendNotification(subscriber.expoToken, `${templateOwner.firstName} ${templateOwner.lastName}`, args.content);

                await Stream.findByIdAndUpdate(streams[i]._id, {
                    hasUnread: true
                });
    
                message.save();
            };

            return true;
        } catch (e) {
            errorLogger.error(e);
            return false;
        } 
    }
};