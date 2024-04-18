const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true // Set unique option to true to enforce uniqueness
  },
  password: String,
  usertype: { type: String  }
  
});
const UserModel = mongoose.model('User', userSchema);


const callHistorySchema = new mongoose.Schema({
  callerId: { type: String, required: true },
  calleeId: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  duration: { type: Number, required: true }, // Duration in seconds
});

const  CallHistory = mongoose.model('CallHistory', callHistorySchema);

module.exports = { UserModel,CallHistory};

