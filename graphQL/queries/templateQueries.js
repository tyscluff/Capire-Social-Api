import { GraphQLID, GraphQLString, GraphQLList, GraphQLBoolean } from 'graphql';
import TemplateType from '../types/TemplateType.js';
import Template from '../../models/templateModel.js';
import Stream from '../../models/streamModel.js';

export const template = {
    type: TemplateType,
    args: { id: { type: GraphQLID }},
    resolve (parent, args) {
        return Template.findById(args.id);
    }
};

export const templatesByName = {
    type: new GraphQLList(TemplateType),
    args: { search: { type: GraphQLString }},
    resolve (parent, args) { 
        return Template.find({ title: { $regex: args.search, $options: "i" }});
    }
}; 

export const getUserTemplates = { 
    type: new GraphQLList(TemplateType),
    resolve (parent, args, context) {
        return Template.find({ ownerId: context.id });
    }
};

export const checkIfUserIsInStream = {
    type: GraphQLBoolean,
    args: { 
        templateId: { type: GraphQLID },
        userId: { type: GraphQLID }
    },
    async resolve (parent, args) {
        const exists = await Stream.exists({ $and: [ { subscriberId: args.userId }, { templateId: args.templateId }]});

        if (exists) { 
            return true;
        } else {
            return false;
        }
    }
};