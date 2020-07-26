import express from 'express'

import userRoute from './controllers/userController.mjs';
import dairyRoute from './controllers/dairyController.mjs';
const index = express.Router();

index.use('/user', userRoute);
index.use('/dairy', dairyRoute);


index.get('/', (req, res) => {
    return res.json({success: true})
});

export default index
