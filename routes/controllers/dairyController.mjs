import express from 'express'
import mongoose from 'mongoose'
import httpStatus from 'http-status-codes';

import Dairy from '../../models/dairy.mjs';
import logger from '../../helpers/logger.mjs';

const router = express.Router();


router.get('/', async (req, res) => {
    try{
        // build query string from query params
        let query = {};
       let dairies = await Dairy.find(query).exec();
       return res.json({dairies});
    }catch(e){
        logger.error(e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'could not fetch dairies'})
    }
});


router.post('/', async (req, res) => {
    try{
        let dairy = new Dairy({
            title: req.body.title,
            manager: req.body.manager,
            address: req.body.address,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password,
            location: req.body.location,
            rate: req.body.rate
        });

/* 
    TODO: rate field should include rates for all the types of milk.
        currently it is set to `Number` and defaults to cow milk
*/

        dairy = (await dairy.save()).toObject();
        delete dairy.password
        return res.json({dairy});
    }catch(e){
        // if error is validationError then send validatorErrors s response
        if(e instanceof mongoose.Error.ValidationError){
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(e.errors);
        }
        logger.error(e);
        return res.status(500).json({msg: 'could not create dairy'});
    }
});



export default router;
