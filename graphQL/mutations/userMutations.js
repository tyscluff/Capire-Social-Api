import { GraphQLString } from 'graphql';
import User from '../../models/userModel.js';
import UserType from '../types/UserType.js';

export const updateExpoToken = {
    type: UserType,
    args: {
        expoToken: { type: GraphQLString }
    },
    async resolve (parent, args, context) {
        await User.findByIdAndUpdate(context.id, {
            expoToken: args.expoToken
        });

        const user = await User.findById(context.id);

        return user;
    }
};

export const deleteUser = {
    type: UserType,
    async resolve (parent, args, context) {
        const user = await User.findById(context.id);
        await User.findByIdAndDelete(context.id);
        return user;
    }
};