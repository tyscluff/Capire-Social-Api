import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const messageSchema = new Schema({  
    streamId: { type: String, required: true },
    streamOwnerId: { type: String },
    streamSubscriberId: { type: String },
    intentId: { type: String, default: null },
    fromStreamOwner: { type: Boolean, required: true },
    hasResponse: { type: Boolean, default: false },
    isFile: { type: Boolean, default: false }, 
    isBlast: { type: Boolean, default: false },
    content: { type: String, required: true },
    timeSent: { type: Number, required: true }, 
    isRead: { type: Boolean, default: false }
});   

const myCapireDB = mongoose.connection.useDb("my_capire_main");

const Message = myCapireDB.model('Message', messageSchema, 'messages');

export default Message;