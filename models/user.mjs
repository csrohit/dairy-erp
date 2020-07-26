import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


export const roles = ['farmer', 'dairy_manager']


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: roles,
        required: true
    },
    dairy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dairy'
    }
});

// pre hooks
userSchema.pre('save', async function(next){
    // encrypt password
    
});


const User = mongoose.model('User', userSchema);

export default User;