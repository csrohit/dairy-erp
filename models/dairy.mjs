import mongoose from 'mongoose'

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
},{ _id : false })

const dairySchema = mongoose.Schema({
    title: { type: String, required: true},
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    address: addressSchema,
    phone: { type: String },
    customers: [ {type: mongoose.Schema.Types.ObjectId, ref: 'User'} ],


    createdAt: { type: Date, default: Date.now()},
    lastModifiedAt: {type: Date, default: Date.now()}
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

