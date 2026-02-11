import winston, { type LoggerOptions } from 'winston';
import * as fs from 'fs';
import * as path from 'path';

const logDir = '/tmp/logs';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export const loggerOptions: LoggerOptions = {
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => `[${timestamp}] ${level}: ${message}`),
  ),
  transports: [
    new winston.transports.Console(),

    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3,
    }),

    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3,
    }),
  ],
};
