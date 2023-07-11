import { 
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean
} from 'graphql';
import Message from '../../models/messageModel.js';
import User from '../../models/userModel.js';
import Template from '../../models/templateModel.js';
import UserType from './UserType.js';
import MessageType from './MessageType.js';
import TemplateType from './TemplateType.js';

const StreamType = new GraphQLObjectType({
    name: "Stream",
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLInt },
        ownerId: { type: GraphQLID },
        subscriberId: { type: GraphQLID },
        templateId: { type: GraphQLID }, 
        hasUnread: { type: GraphQLBoolean }, 
        photoId: { type: GraphQLID },
        owner: {  
            type: UserType,
            resolve (parent, args) {
                return User.findById(parent.ownerId);
            }
        }, 
        template: { 
            type: TemplateType,
            resolve (parent, args) {
                return Template.findById(parent.templateId);
            }
        },
        subscriber: {
            type: UserType,
            resolve (parent, args) {
                return User.findById(parent.subscriberId)
            }
        },
        messages: {  
            type: new GraphQLList(MessageType),
            async resolve (parent, args) {
                return Message.find({ streamId: parent.id })
                .sort({ "timeSent": -1 });
            } 
        },
        newSubscriberMessages: {
            type: new GraphQLList(MessageType),
            resolve (parent, args) {
                return Message.find({ $and: [
                    {
                        streamId: parent.id
                    }, 
                    { 
                        hasResponse: false
                    },
                    {
                        fromStreamOwner: false
                    },
                    {
                        intentId: null
                    }
                ]})
                .sort({ "timeSent": -1 });
            }
        }
    }) 
});
 
export default StreamType;