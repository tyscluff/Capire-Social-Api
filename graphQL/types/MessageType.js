import { 
    GraphQLBoolean,
    GraphQLID,
    GraphQLObjectType,
    GraphQLString, 
} from 'graphql'; 
import GraphQLLong from 'graphql-type-long';
import Stream from '../../models/streamModel.js';
import User from '../../models/userModel.js';
import StreamType from './StreamType.js';
import UserType from './UserType.js';
 
const MessageType = new GraphQLObjectType({
    name: "Message",
    fields: () => ({
        id: { type: GraphQLID },
        content: { type: GraphQLString },
        fromStreamOwner: { type: GraphQLBoolean },
        streamId: { type: GraphQLID }, 
        streamOwnerId: { type: GraphQLID },
        streamSubscriberId: { type: GraphQLID },
        isBlast: { type: GraphQLBoolean },
        timeSent: { type: GraphQLLong },
        intentId: { type: GraphQLID },
        hasResponse: { type: GraphQLBoolean },
        stream: { 
            type: StreamType, 
            resolve(parent, args) {
                return Stream.findById(parent.streamId)
            }
        },
        streamOwner: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.streamOwnerId)
            }
        },
        streamSubscriber: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.streamSubscriberId)
            } 
        }
    })
});

export default MessageType;