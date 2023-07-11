import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}] ${message}`
});

const errorLogger = createLogger({
    transports: [
        new transports.File({
            name: 'error-file',
            filename: './logger/logs/errors.log',
            level: 'warn',
            format: combine(timestamp({format: "HH:mm:DD:MM:YYYY"}), myFormat),
          }),
    ],
    exitOnError: false,
});

export default errorLogger;