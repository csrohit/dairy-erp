import express from 'express'

import userRoute from './controllers/userController.mjs';
import dairyRoute from './controllers/dairyController.mjs';
import readingRoute from './controllers/readingController.mjs';

const index = express.Router();

index.use('/user', userRoute);
index.use('/dairy', dairyRoute);
index.use('/reading', readingRoute);


index.get('/', (req, res) => {
    return res.json({success: true})
});

export default index
