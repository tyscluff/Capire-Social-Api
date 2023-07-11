import { 
    GraphQLID,
    GraphQLList,
    GraphQLObjectType,
    GraphQLString
} from 'graphql';
import Stream from '../../models/streamModel.js';
import StreamType from './StreamType.js';

const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLID },
        email: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        expoToken: { type: GraphQLString },
        ownedStreams: { 
            type: new GraphQLList(StreamType),
            resolve (parent, args) {
                return Stream.find({ ownerId: parent.id });
            }
        },
        subscribedStreams: { 
            type: new GraphQLList(StreamType),
            resolve (parent, args) {
                return Stream.find({ subscriberId: parent.id })
            }
        }
    })
});

export default UserType