import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLList } from 'graphql';
import StreamType from './StreamType.js';
import Stream from '../../models/streamModel.js';
import IntentType from './IntentType.js';
import Intent from '../../models/intentModel.js';
import UserType from './UserType.js';
import User from '../../models/userModel.js';

const TemplateType = new GraphQLObjectType({
    name: "Template",
    fields: () => ({
        id: { type: GraphQLID },
        ownerId: { type: GraphQLID }, 
        price: { type: GraphQLInt },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        photoId: { type: GraphQLString },
        contactEmail: { type: GraphQLString },
        bookingUrl: { type: GraphQLString },
        owner: { 
            type: UserType,
            resolve (parent, args) {
                return User.findById(parent.ownerId)
            }
        },
        intents: { 
            type: new GraphQLList(IntentType),
            resolve (parent, args) {
                return Intent.find({ $and: [{ templateId: parent.id }, { isSpam: false }, { hasResponse: false }]}).sort({ "volume": -1 });
            } 
        },
        allIntents: {
            type: new GraphQLList(IntentType),
            resolve (parent, args) {
                return Intent.find({ $and: [{ templateId: parent.id }, { isSpam: false }]}).sort({ "volume": -1 })
            }
        },
        streams: {
            type: new GraphQLList(StreamType),
            resolve (parent, args) {
                return Stream.find({ templateId: parent.id});
            }
        }
    })
}); 

export default TemplateType; 