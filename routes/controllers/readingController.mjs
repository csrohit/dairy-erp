import express from 'express'
import httpStatus from 'http-status-codes';
import logger from '../../helpers/logger.mjs'
import Reading from '../../models/milkReading.mjs';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req, res) => {
    try{
        let query = {};
        let readings = await Reading.find(query).exec();
        return res.json({readings});
    }catch(e){
        logger.error(e);
        return res.status(httpStatus(httpStatus.INTERNAL_SERVER_ERROR)).json({msg: 'could not get readings'});
    }
});

router.post('/', async (req, res) => {
    try{
        let reading = new Reading({
            type: req.body.type,
            volume: req.body.volume,
            lactoReading: req.body.lactoReading,
            dairy: req.body.dairy,
            farmer: req.body.farmer,
            amount: req.body.amount,
            rate: req.body.rate,
        });
        reading = (await reading.save()).toObject();
        return res.json({reading});
    }catch(e){
        if(e instanceof mongoose.Error.ValidationError){
            return res.status(httpStatus.NOT_ACCEPTABLE).json({type: 'validationError', msg: e.errors});
        }
        logger.error(e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({msg: 'Could not create a readings'});
    }
});



export default router;