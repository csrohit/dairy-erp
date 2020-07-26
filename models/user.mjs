import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import logger from '../helpers/logger.mjs';


export const roles = ['farmer', 'dairy_manager']


const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    userName:{ type: String, required:true },
    email: { type: String, required: true },
    age: { type: Number, min: [18, 'Age should be greater than 18'], max: [100, 'Age should not be greater than 100'] },
    password: { type: String, required: true },
    role: { type: String, enum: roles, required: true },
    dairy: { type: mongoose.Schema.Types.ObjectId, ref: 'Dairy' }
});



userSchema.pre('validate', async function(next){
    logger.debug('preValidate');
    next();
});
userSchema.post('validate', async function(doc, next){
    // all the basic validation is co
    // logger.info("Document",{data: doc});
    logger.debug('postValidate')
    next();
})

// Hash the password before saving to database
userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});




const User = mongoose.model('User', userSchema);

export default User;

/* 

when validating a path or a document
err is a validation error
and 
err.name.err is validator error




*/