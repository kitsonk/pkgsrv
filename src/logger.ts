import winston from 'winston';
import 'winston-loggly-bulk';
import config from './config';

const logger = new winston.Logger({ level: 'info' });

function formatter(options: any): string {
	return (
		`${options.timestamp()} ` +
		`${winston.config.colorize(options.level, options.level.toUpperCase())} ` +
		`${options.message ? options.message : ''}` +
		`${options.meta && Object.keys(options.meta).length ? `\n\t${JSON.stringify(options.meta)}` : ''}`
	);
}

export function logToConsole(): void {
	logger.add(winston.transports.Console, {
		timestamp() {
			return new Date().toISOString();
		},
		formatter,
		level: config.debug ? 'debug' : 'info'
	});
}

export function logToFile(): void {
	logger.add(winston.transports.File, { name: 'error-file', filename: 'error.log', level: 'error' });
	logger.add(winston.transports.File, { name: 'combined-file', filename: 'combined.log' });
}

export function logToLoggly(token: string, subdomain: string, tags: string[] = []) {
	logger.debug(`logToLoggly("${token}", "${subdomain}", ${JSON.stringify(tags)}, ${config.debug})`);
	logger.add(winston.transports.Loggly, {
		json: true,
		level: config.debug ? 'debug' : 'info',
		subdomain,
		tags: ['Winston-NodeJS', ...tags],
		token
	});
}

export default logger;
