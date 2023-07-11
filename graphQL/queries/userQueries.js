import { GraphQLID } from 'graphql';
import User from '../../models/userModel.js';
import UserType from '../types/UserType.js';

export const user = {
    type: UserType,
    args: { id: { type: GraphQLID }},
    resolve (parent, args) {
        return User.findById(args.id)
    }
}; 