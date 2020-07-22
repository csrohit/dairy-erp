import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'


import {db_host, db_name, port} from './config.mjs'
import { logger } from './helpers/logger.mjs'
const app = express();

// let express know that it is running behind proxy
app.set('trust proxy', 'loopback');

//* connect to database
// mongoose.connect(db_host+'/'+db_name, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
//     .then(() => {
//         console.log(`connected to database ${db_name}`);
//     }).catch( err => {
//         //* In case of failed connection close the server
//         console.debug('Could not connect to database', db_name);
//         process.kill(process.pid, 'SIGTERM');
//     });

/* App level middleware */
// morgan logging
app.use(morgan('tiny', {stream: logger.stream}));


// error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({msg: 'Something went wrong!'});
});
  


// store server instance in variable
const server = app.listen(port, () => {
    logger.error(`App listening on port: ${port}`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received');
    server.close(() => {
        //* close db connection
        mongoose.connection.close(err => {
            if(err){
                console.debug('Error closing DB connection');
            }
            console.info('DB connection closed');
        });
        // process.exit(1);
    });
});

app.get('/', (req, res) => {
    logger.error('somethii');
    return res.json({success: true});

})