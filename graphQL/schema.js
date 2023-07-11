import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { message } from './queries/messageQueries.js';
import { stream } from './queries/streamQueries.js';
import { user } from "./queries/userQueries.js";
import { intent } from "./queries/intentQueries.js";
import {  
    template, 
    templatesByName, 
    checkIfUserIsInStream,
    getUserTemplates
} from './queries/templateQueries.js';
import { addMessage, mergeMessages, giveMessageIntent }from "./mutations/messageMutations.js";
import { addStream, deleteStream, markRead } from "./mutations/streamMutations.js";
import { addIntent, assignIntent, respondToIntent } from "./mutations/intentMutations.js";
import { addTemplate, messageTemplate } from "./mutations/templateMutations.js";
import { updateExpoToken, deleteUser } from "./mutations/userMutations.js";

const RootQuery = new GraphQLObjectType({ 
    name: "RootQueryType",
    fields: {
        message, 
        stream,
        user,
        template,
        templatesByName,
        checkIfUserIsInStream,
        intent,
        getUserTemplates
    }
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addMessage, 
        addStream,
        deleteStream,
        mergeMessages, 
        addIntent,
        assignIntent,
        addTemplate,
        updateExpoToken,
        respondToIntent,
        messageTemplate,
        deleteUser,
        giveMessageIntent,
        markRead
    }
});

export default new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
}); 