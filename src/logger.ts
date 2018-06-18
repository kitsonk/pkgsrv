import { format } from 'logform';
import { createLogger, transports } from 'winston';

const logger = createLogger({
	level: 'info',
	format: format.combine(format.timestamp(), format.json())
});

export function logToFile() {
	logger.add(new transports.File({ filename: 'error.log', level: 'error' }));
	logger.add(new transports.File({ filename: 'combined.log' }));
}

export function logToConsole(verbose = false): void {
	logger.add(
		new transports.Console({
			format: format.combine(
				format.colorize(),
				format.timestamp(),
				format.align(),
				format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
			),
			level: verbose ? 'verbose' : 'info'
		})
	);
}

export default logger;
