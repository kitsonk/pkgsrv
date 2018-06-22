import winston from 'winston';
// import { spy } from 'sinon';

export function createLogger(options?: winston.LoggerOptions) {
	const logger = new winston.Logger(options);
	return logger;
}
