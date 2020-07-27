import mongoose from 'mongoose'

export const milkTypes = ['cow', 'buffalo', 'goat', 'sheep'];

const readingSchema = mongoose.Schema({
    type: { type: String, enum: milkTypes, required: true },
    volume: { type: Number, required: true },
    lactoReading: { type: Number, default: 30 },
    dairy : { type: mongoose.Schema.Types.ObjectId, ref: 'Dairy'},
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    amount: { type: Number},
    rate: { type: Number },
    collectedAt: { type: Date, default: Date.now(), alias: 'deliveredAt'}
});
const Reading = mongoose.model('Reading', readingSchema);



export default Reading;