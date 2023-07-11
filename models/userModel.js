import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    expoToken: { type: String }
}); 

const myCapireDB = mongoose.connection.useDb("my_capire_main");

const User = myCapireDB.model("User", userSchema, "users");

export default User; 