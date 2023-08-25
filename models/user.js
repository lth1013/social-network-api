const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//creating a new user schema

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    // Array of _id values referencing the Thought model
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
//   Schema Settings

// Create a virtual called friendCount that retrieves the length of the user's friends array field on query.
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
    friendCount: {
        virtuals: true,
        get: function () {
          return this.friends.length;
        },
        },
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
