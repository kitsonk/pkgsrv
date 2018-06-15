import yargs from 'yargs';
import logger from './logger';
import Koa from 'koa';
import { create as createFetchModule } from './fetchModule';
import logRequest from './logRequest';

const argv = yargs
	.pkgConf('pkgsrv')
	.usage('usage: $0')
	.option('p', {
		alias: 'port',
		default: 3000,
		describe: 'port to listen on',
		type: 'number'
	})
	.option('b', {
		alias: 'base',
		default: process.cwd(),
		describe: 'path to serve as base for server',
		type: 'string'
	}).argv;

const port: number = argv['p'];
const basePath: string = argv['b'];

logger.info('Starting up...');

const app = new Koa();

app.use(logRequest);
app.use(createFetchModule(basePath));

app.listen(port);

logger.info(`Listening on port: ${port}`);
logger.info(`Base path: ${basePath}`);

export = {};
