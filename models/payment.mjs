import mongoose from 'mongoose'


const paymentSchema = mongoose.Schema({
    amount: { type: Number, required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    dairy: { type: mongoose.Schema.Types.ObjectId, ref: 'Dairy'},
    madeAt: { type: Date, default: Date.now()}
});

//TODO: add transactionID for txn xompleted on app using paytm api or similar

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;