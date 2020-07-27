import express from 'express';
import mongoose from 'mongoose';
import httpStatus from 'http-status-codes';

import Payment from '../../models/payment.mjs';
import logger from '../../helpers/logger.mjs';

const router = express.Router();

router.get('/', async (req, res) => {
    try{
        //* build query from request querystring/params
        let query = {};
        let payments = await Payment.find({}).exec();
        return res.json({payments});
    }catch(e){
        logger.error(e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({msg: 'Could not fetch payment information!'});
    }
});

router.post('/', async (req, res) => {
    try{
        let payment = new Payment({
            amount: req.body.amount,
            farmer: req.body.farmer,
            dairy: req.body.dairy,
        })
        payment = (await payment.save()).toObject();
        return res.json({payment});
    }catch(e){
        if(e instanceof mongoose.Error.ValidationError){
            return res.status(httpStatus.NOT_ACCEPTABLE).json({type: 'validationError', msg: e.errors});
        }
        logger.error(e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({msg: 'Could not create new payment information!'})
    }
});




export default router;