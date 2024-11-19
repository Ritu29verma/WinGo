const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  phoneNo: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  inviteCode:{
    type:String,
  },
  agree:{
    type:Boolean,
    default:false,
    required: true,
  },
  createdAt:{
    type:Date,
    default:Date.now  
  },
  updatedAt:{
    type:Date,
    default:Date.now
    }
});
const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
