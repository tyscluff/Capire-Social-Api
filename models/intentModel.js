import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const intentSchema = new Schema({
    templateId: { type: String, required: true },
    baseQuestion: { type: String, required: true },
    volume: { type: Number, default: 1 },
    isSpam: { type: Boolean, default: false },
    hasResponse: { type: Boolean, default: false },
    response: { type: String },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Number } 
});  
 
const myCapireDB = mongoose.connection.useDb("my_capire_main");

const Intent = myCapireDB.model("Intent", intentSchema, "intents");

export default Intent;