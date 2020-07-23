import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'


import {db_host, db_name, port} from './config.mjs'
import logger from './helpers/logger.mjs'
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
app.use(morgan((tokens, req, res) => {
    return JSON.stringify(
        {
            'method': tokens.method(req, res),
            'url': tokens.url(req, res),
            'status': tokens.status(req, res),
            'response-time': `${tokens['response-time'](req, res)} ms`,
            'host': req.hostname
        });
}, {stream: logger.stream}));
morgan.token('host', function(req, res) {
    return req.hostname;
});

app.get('/', (req, res) => {
    throw Error("lwjfhkjk");
    return res.json({success: true});
});
// error handling middleware
app.use((err, req, res, next) => {
    logger.error(err);
    res.status(500).json({msg: 'Something went wrong!'});
});

// store server instance in variable
const server = app.listen(port, () => {
    logger.info(`App listening on port: ${port}`);
});

process.on('SIGTERM', () => {
    // when process is killed SIGTERM signal is received
    console.log('SIGTERM signal received');
    server.close(() => {
        //* close db connection
        mongoose.connection.close(err => {
            if(err){
                console.debug('Error closing DB connection');
            }
            console.info('DB connection closed');
        });
        process.exit(1);
    });
});

process.on('SIGINT', () => {
    // When CTRL-C is pressed SIGINT signall is received
    logger.info('Bye...!');
    process.exit(1);
});


/* 
    ? When having problems with nodemon and getting error of `uncaughtException: listen EADDRINUSE: address already in use :::3000`
    ?    1. Get pid of process listening on port 3000
    ?        => lsof -u :3000
    ?    2. Get pid of parent process i.e. (nodemon)
    ?        => ps -Flww -p ${ppid}
    ?   3. Kill the process with pid ${ppid}
    ?        => kill ${ppid}
*/
