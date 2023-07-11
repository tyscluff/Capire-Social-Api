import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const streamSchema = new Schema({
    templateId: { type: String, required: true },
    ownerId: { type: String, required: true },
    subscriberId: { type: String, required: true },
    price: { type: Number, required: true }, 
    hasUnread: { type: Boolean, default: false },
    title: { type: String, required: true, maxLength: 30 },
    description: { type: String, maxLength: 550 },
    photoId: { type: String }
}); 

const myCapireDB = mongoose.connection.useDb("my_capire_main");

const Stream = myCapireDB.model("Stream", streamSchema, "streams");

export default Stream; 