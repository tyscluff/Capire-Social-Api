import {
    GraphQLID, 
    GraphQLList, 
    GraphQLString
} from 'graphql';
import Stream from '../../models/streamModel.js';
import StreamType from '../types/StreamType.js';

export const stream = {
    type: StreamType,
    args: { id: { type: GraphQLID }},
    resolve (parent, args) {
        return Stream.findById(args.id);
    }
}; 

export const streamsByName = {
    type: new GraphQLList(StreamType),
    args: { search: { type: GraphQLString }},
    resolve (parent, args) {
        return Stream.find({ title: { $regex: args.search, $options: "i" }})
    }
};