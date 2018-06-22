import { join } from 'path';
import yargs from 'yargs';
import app from './app';
import config from './config';
import logger, { logToConsole, logToFile, logToLoggly } from './logger';

const packageJson: { version: string } = require('../package.json');

const argv = yargs
	.pkgConf('pkgsrv')
	.usage('usage: $0')
	.option('b', {
		alias: 'base',
		default: join(process.cwd(), 'packages'),
		describe: 'path to serve as base for server',
		type: 'string'
	})
	.option('d', {
		alias: 'debug',
		default: false,
		describe: 'enable debug logging',
		type: 'boolean'
	})
	.option('l', {
		alias: 'logs',
		default: false,
		describe: 'send the logs to an error and combined file',
		type: 'boolean'
	})
	.option('p', {
		alias: 'port',
		default: 3000,
		describe: 'port to listen on',
		type: 'number'
	})
	.option('s', {
		alias: 'subdomain',
		describe: 'Loggly subdomain',
		type: 'string'
	})
	.option('t', {
		alias: 'token',
		describe: 'Loggly security token',
		type: 'string'
	}).argv;

// Interpret arguments
const port: number = argv['p'];
const token: string | undefined = argv['t'];
const subdomain: string | undefined = argv['s'];
const flagLogToFile: boolean = argv['l'];

// Update configuration
config.basePath = argv['b'];
config.debug = argv['d'];

// Setup logging
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
