import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// separate schema for address without `_id`
const addressSchema = mongoose.Schema({
    pincode: { type: Number, min: [100000, 'Invalid Pincode'], max: [999999, 'Ivalid Pincode']},
    line1: {type: String },
    line2: {type: String },
    villTown: { type: String },
    taluka: { type: String },
    district: { type: String },
    state: { type: String, default: 'Maharashtra' },
    country: { type: String, default: 'India'}
},{ _id : false });

const coordinateSchema = mongoose.Schema({
    x: { type: Number},
    y: { type: Number}
}, { _id: false});


const dairySchema = mongoose.Schema({
    title: { type: String, required: true},
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    address: addressSchema,
    phone: { type: String },
    email: { type: String },
    password: { type: String },
    location: { type: coordinateSchema, alias: 'coords'},
    rate: { type: Number},   // rate will be updated frequently a per the price of milk
    customers: [ {type: mongoose.Schema.Types.ObjectId, ref: 'User'} ],
    createdAt: { type: Date, default: Date.now()},
    lastModifiedAt: {type: Date, default: Date.now()},
});

/* 
    TODO: rate field should include rates for all the types of milk.
        currently it is set to `Number` and defaults to cow milk
*/

/* 
    instead of calling next() manually, you can use a function that returns a promise.
    In particular, you can use async/await.
*/
dairySchema.pre('save', async function(){
    let salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

dairySchema.post('save', async (doc, next) => {
    /* 
        get manager of dairy and if reference of this dairy is not
        present at manager then add reference of this dairy
    */ 
    next();
});

const Dairy = mongoose.model('Dairy', dairySchema);

export default Dairy;

