const mongoose = require('mongoose');
const Schema  = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
})
//no need to define usermane and password bcz mongoose automatically defined in schema also do hashing and salting

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);