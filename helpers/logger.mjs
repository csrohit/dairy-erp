import winston from "winston";
import colorize from 'json-colorizer';

export const logger = new winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({stack: true}),
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize(),
  ),
  exceptionHandlers: [
    new winston.transports.File({ filename: './logs/exceptions.log' })
  ],
    transports: [
    // new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
    // new winston.transports.File({ filename: './logs/combined.log' }),
  ]
});

// when in development print logs to the console
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.align(),
        winston.format.timestamp({
          format: function(){
            return new Date(Date.now() + 330 * 60000).toUTCString().replace("GMT", "IST");
          },
        }),
        winston.format.printf(info => {
          let {timestamp, level, message, ...meta } = info;
          // print data from the meta object
          let log = `${timestamp} | ${level} |`;
          log += message? ` ${message} |`:'';
          log += meta.data?`\n ${colorize(meta.data)} | `:''
          log += meta.stack?`\n ${meta.stack}`:''
          return  log
        }),
      )
    })
  )
}


// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function (data, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info('Req => ',{data: data.replace('\n', '')});
  },
};

export default logger
