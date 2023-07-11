import { 
    GraphQLID
} from 'graphql';
import Intent from '../../models/intentModel.js';
import IntentType from '../types/IntentType.js';

export const intent = {
    type: IntentType,
    args: { id: { type: GraphQLID }}, 
    resolve (parent, args) {
        return Intent.findById(args.id);
    }
}; 
