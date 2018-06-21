import yargs from 'yargs';
import logger, { logToConsole, logToFile, logToLoggly } from './logger';
import Koa from 'koa';
import logRequest from './logRequest';
import router, { setBasePath } from './router';

const packageJson: { version: string } = require('../package.json');

const argv = yargs
	.pkgConf('pkgsrv')
	.usage('usage: $0')
	.option('b', {
		alias: 'base',
		default: process.cwd(),
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
const basePath: string = argv['b'];
const token: string | undefined = argv['t'];
const subdomain: string | undefined = argv['s'];
const flagLogToFile: boolean = argv['l'];
const flagDebug: boolean = argv['d'];

// Setup logging
if (flagLogToFile) {
	logToFile();
}
if (process.env.NODE_ENV !== 'production') {
	logToConsole(flagDebug);
}
if (token && subdomain) {
	logToLoggly(token, subdomain, ['pkgsrv'], flagDebug);
}

logger.info(`Startup - pkgsrv@${packageJson.version}`);

// Create app instance
const app = new Koa();

// Setup middleware
app.use(logRequest);
setBasePath(basePath);
app.use(router.routes());
app.use(router.allowedMethods());

// Listen on port
app.listen(port);

logger.info(`Listening on port: ${port}`);
logger.verbose(`Base path: ${basePath}`);
