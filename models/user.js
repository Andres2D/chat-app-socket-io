
const { Schema, model } = require('mongoose');

const Userschema = Schema({
    name: {
        type: String,
        require: [true, 'The name is required']
    },
    email: {
        type: String,
        require: [true, 'The email is required'],
        unique: true
    },
    password: {
        type: String,
        require: [true, 'The password is required']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE', 'SALES_ROLE']
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }    
});

Userschema.methods.toJSON = function() {
    let {_id, __v, password, ...user } = this.toObject();
    user.uid = _id;
    return user;
}

module.exports = model('User', Userschema);
