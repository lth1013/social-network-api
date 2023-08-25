const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//creating a new thought schema

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (timestamp) => dateFormat(timestamp),
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema],
    },
    {   
        toJSON: {
            getters: true,
        },
        id: false,
        reactionCount: {
            virtuals: true,
            get: function () {
                return this.reactions.length;
            },
        },
    }
);

const Thought = mongoose.model("Thought", thoughtSchema);

module.exports = Thought;

