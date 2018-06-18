import yargs from 'yargs';
import logger, { logToConsole, logToFile } from './logger';
import Koa from 'koa';
import { create as createFetchModule } from './fetchModule';
import logRequest from './logRequest';
import packageJson from '../package.json';

const argv = yargs
	.pkgConf('pkgsrv')
	.usage('usage: $0')
	.option('b', {
		alias: 'base',
		default: process.cwd(),
		describe: 'path to serve as base for server',
		type: 'string'
	})
	.option('p', {
		alias: 'port',
		default: 3000,
		describe: 'port to listen on',
		type: 'number'
	})
	.option('v', {
		alias: 'verbose',
		default: false,
		describe: 'log verbose to console',
		type: 'boolean'
	}).argv;

const port: number = argv['p'];
const basePath: string = argv['b'];

logToFile();
if (process.env.NODE_ENV !== 'production') {
	logToConsole(argv['v']);
}

logger.info(`Startup - pkgsrv@${packageJson.version}`);

const app = new Koa();

// Setup middleware
app.use(logRequest);
app.use(createFetchModule(basePath));

// Listen on port
app.listen(port);

logger.info(`Listening on port: ${port}`);
logger.verbose(`Base path: ${basePath}`);
