import { join } from 'path';
import app from './app';
import config from './config';
import logger, { logToConsole, logToFile, logToLoggly } from './logger';

const packageJson: { version: string } = require('../package.json');

export interface StartOptions {
	basePath?: string;
	debug?: boolean;
	flagLogToFile?: boolean;
	port?: number;
	subdomain?: string;
	token?: string;
}

/**
 * Start the pkgsrv based on the options provided.
 * @param options Options to use when starting the server
 */
export function start(options: StartOptions = {}): void {
	const {
		basePath = join(process.cwd(), 'packages'),
		debug = false,
		flagLogToFile = false,
		port = 3000,
		subdomain,
		token
	} = options;
	config.basePath = basePath;
	config.debug = debug;
	if (flagLogToFile) {
		logToFile();
	}
	if (process.env.NODE_ENV !== 'production') {
		logToConsole();
	}
	if (token && subdomain) {
		logToLoggly(token, subdomain, ['pkgsrv']);
	}

	logger.info(`Startup - pkgsrv@${packageJson.version}`);

	// Listen on port
	app.listen(port);

	logger.info(`Listening on port: ${port}`);
	logger.verbose(`Base path: ${config.basePath}`);
}

export { default as app } from './app';
export { default as config } from './config';
export { default as logger, logToConsole, logToFile, logToLoggly } from './logger';
