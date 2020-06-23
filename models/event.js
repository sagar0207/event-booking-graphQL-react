// creating model using mongoose for mongoDB that includes how the event schema should look like.
const mongoose = require('mongoose');

// constructor func of Schema to generate new Schema objects
const Schema = mongoose.Schema;

// eventSchema for mongoDB should be in sync with graphQL schema for event
const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

// create a model based on the schema
module.exports = mongoose.model('Event', eventSchema);