import express from 'express'

import userRoute from './controllers/userController.mjs';
const index = express.Router();

index.use('/user', userRoute);



index.get('/', (req, res) => {
    return res.json({success: true})
});


// // const index = ''


export default index

// const router = require('express').Router()
// router.get('/', (req, res) => {
//     return res.json({success:true, msg:"Connected to server"});
// })



// module.exports = router