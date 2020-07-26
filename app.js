// const express = require('express'),
//     mongoose = require('mongoose'),
//     morgan = require('morgan');


// const {db_host, db_name, port} = require('./config'),
//     logger = require('./helpers/logger'),
    // index = require('./routes/index');

import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import { db_host, db_name, port } from './config.mjs';
import logger from './helpers/logger.mjs';
import index from './routes/index.mjs';



const app = express();

// let express know that it is running behind proxy
app.set('trust proxy', 'loopback');

//* connect to database
mongoose.connect(db_host+'/'+db_name, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
    .then(() => {
        logger.info(`connected to database ${db_name}`);
    }).catch( err => {
        //* In case of failed connection close the server
        logger.error('Could not connect to database', db_name);
        process.kill(process.pid, 'SIGTERM');
    });

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

// Only using json for api
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// routes
app.use('/', index);


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

// winston doesn't handled promise rejection exception, handle those rejection here and pass on to winston
process.on('unhandledRejection', (reason, promise) => {
    throw reason;
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
