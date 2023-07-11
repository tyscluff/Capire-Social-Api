import { GraphQLID, GraphQLBoolean } from 'graphql';
import Stream from '../../models/streamModel.js';
import Template from '../../models/templateModel.js';
import StreamType from '../types/StreamType.js'; 

export const addStream = { 
    type: StreamType,
    args: {
        subscriberId: { type: GraphQLID },
        templateId: { type: GraphQLID }
    },
    async resolve (parent, args) {

        const template = await Template.findById(args.templateId);

        const stream = new Stream({
            ownerId: template.ownerId,
            subscriberId: args.subscriberId,
            templateId: args.templateId,
            title: template.title,
            description: template.description,
            price: template.price
        });

        return stream.save();
    }
};

export const deleteStream = {
    type: StreamType,
    args: {
        templateId: { type: GraphQLID },
        subscriberId: { type: GraphQLID }
    },
    async resolve (parent, args) {
        const stream = await Stream.findOne({ $and: [ { templateId: args.templateId}, { subscriberId: args.subscriberId }]})
        await Stream.deleteMany({ $and: [ { templateId: args.templateId}, { subscriberId: args.subscriberId }]});
        return stream;
    }
};

export const markRead = {
    type: GraphQLBoolean,
    args: {
        id: { type: GraphQLID }
    },
    async resolve (parent, args) {
        try {
            await Stream.findByIdAndUpdate(args.id, {
                hasUnread: false
            });

            return true;
        } catch {
            return false;
        }
    }
}; 