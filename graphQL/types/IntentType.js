import { 
GraphQLBoolean,
GraphQLID,
GraphQLInt,
GraphQLList,
GraphQLObjectType,
GraphQLString, 
} from 'graphql';
import GraphQLLong from 'graphql-type-long';
import Message from '../../models/messageModel.js';
import MessageType from './MessageType.js';
import Template from '../../models/templateModel.js';
import TemplateType from './TemplateType.js';

const IntentType = new GraphQLObjectType({
    name: "Intent",
    fields: () => ({
        id: { type: GraphQLID },
        templateId: { type: GraphQLID },
        baseQuestion: { type: GraphQLString },
        volume: { type: GraphQLInt },
        isSpam: { type: GraphQLBoolean },
        hasResponse: { type: GraphQLBoolean },
        response: { type: GraphQLString },
        isRead: { type: GraphQLBoolean },
        createdAt: { type: GraphQLLong },
        template: {
            type: TemplateType,
            resolve: (parent, args) => { 
                return Template.findById(parent.templateId);
            }
        },
        messages: { 
            type: new GraphQLList(MessageType),
            resolve: (parent, args) => {
                return Message.find({ intentId: parent.id });
            }
        }
    })
});

export default IntentType;