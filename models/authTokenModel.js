import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const authTokenSchema = new Schema({
    userId: { type: String, required: true },
    token: { type: String, required: true },
    type: { type: String, required: true }
}); 

const myCapireDB = mongoose.connection.useDb("my_capire_main");

const AuthToken = myCapireDB.model('AuthToken', authTokenSchema, 'authTokens');

export default AuthToken;