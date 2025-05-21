require('dotenv').config();

const mongoose = require('mongoose');
const { v4: uuidv4 } = require("uuid");



mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const exerciseSchema = new mongoose.Schema({
  username: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, required: true }
})
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  _id: { type: String, default: uuidv4}
})

const User = mongoose.model('User', userSchema);
const Exercise = mongoose.model('Exercise', exerciseSchema);




// Export both
module.exports = {
  Exercise,
  User
};
