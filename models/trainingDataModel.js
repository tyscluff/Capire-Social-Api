import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const trainingDataModel = new Schema({
    text1: { type: String, required: true },
    text2: { type: String, required: true },
    isMatch: { type: Boolean },
    streamId: { type: String },
    templateId: { type: String },
    openAIScore: { type: Number }
});

const myCapireDB = mongoose.connection.useDb("my_capire_main");

const TrainingData = myCapireDB.model("TrainingData", trainingDataModel, "trainingDatas");

export default TrainingData;