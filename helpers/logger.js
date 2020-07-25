const {createLogger, format, transports} = require('winston'),
    colorize = require('json-colorizer');

const logger = new createLogger({
  format: format.combine(
    format.timestamp(),
    format.errors({stack: true}),
    format.json(),
    format.prettyPrint(),
    format.colorize(),
  ),
  // exceptionHandlers: [
  //   new transports.File({ filename: './logs/exceptions.log' }),
  //   new transports.Console({
  //     format: format.simple()
  //   })
  // ],
    transports: [
    // new transports.File({ filename: './logs/error.log', level: 'error' }),
    // new transports.File({ filename: './logs/combined.log' }),
  ]
});

// when in development print logs to the console
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.align(),
        format.timestamp({
          format: function(){
            return new Date(Date.now() + 330 * 60000).toUTCString().replace("GMT", "IST");
          },
        }),
        format.printf(info => {
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
module.exports = logger
