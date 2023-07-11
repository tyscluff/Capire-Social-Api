import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const streamImageInfoSchema = new Schema({
    templateId: { type: String, required: true },
    imageId: { type: String, required: true }
});

const myCapireDB = mongoose.connection.useDb("my_capire_main");

const StreamImageInfo = myCapireDB.model('StreamImageInfo', streamImageInfoSchema, 'streamImageInfos');

export default StreamImageInfo;