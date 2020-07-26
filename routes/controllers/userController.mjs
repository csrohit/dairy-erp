import express from 'express';
import mongoose from 'mongoose'

import User from '../../models/user.mjs';
import logger from '../../helpers/logger.mjs';

const router = express.Router();

router.get('/', (req, res) => {
    return res.json({info: 'get list of all users, pass query string to get specific users'});
});

router.post('/', async (req, res) => {
    try{
        let user = new User({
            name: req.body.name,
            userName: req.body.userName,
            password: req.body.password,
            email: req.body.email,
            role: req.body.role,
            dairy: req.body.dairy,
            age: req.body.age
        });
        // if user validation fails, catch errors and send validation errors
        user = (await user.save()).toObject();
        delete user.password
        return res.json({user});
    }catch(e){
        if(e instanceof mongoose.Error.ValidationError){
            return res.status(500).json(e.errors);
        }
        logger.error(e);
        return res.status(500).json({msg: 'could not create user'});
    }
});

export default router;