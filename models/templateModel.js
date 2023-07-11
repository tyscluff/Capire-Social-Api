import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const templateSchema = new Schema({
    ownerId: { type: String, required: true },
    price: { type: Number, required: true },
    title: { type: String, required: true, maxLength: 30 },
    description: { type: String, maxLength: 550 },
    bookingUrl: { type: String },
    contactEmail: { type: String },
    photoId: { type: String },
    approved: { type: Boolean }
}); 

const myCapireDB = mongoose.connection.useDb("my_capire_main");

const Template = myCapireDB.model("Template", templateSchema, "templates");

export default Template; 