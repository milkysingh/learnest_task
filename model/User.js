const mongoose = require("mongoose");
const constants = require("../constants");

const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      `${constants.errorResponse.INVALID_EMAIL}`,
    ],
  },
  password: { type: String },
  phoneNo: { type: String },
  dob: { type: Date },

  tokens: [
    {
      access: {
        type: String,
        required: true,
      },
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

mongoose.model("users", userSchema);
