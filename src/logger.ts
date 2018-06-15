import { format } from 'logform';
import { createLogger, transports } from 'winston';

const logger = createLogger({
	level: 'info',
	format: format.combine(format.timestamp(), format.json()),
	transports: [
		new transports.File({ filename: 'error.log', level: 'error' }),
		new transports.File({ filename: 'combined.log' })
	]
});

if (process.env.NODE_ENV !== 'production') {
	logger.add(
		new transports.Console({
			format: format.combine(
				format.colorize(),
				format.timestamp(),
				format.align(),
				format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
			)
		})
	);
}

export default logger;
