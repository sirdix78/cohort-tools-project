const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    email: { type: String, unique: true},
    password: { type: String },
    name: { type: String }
})

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;