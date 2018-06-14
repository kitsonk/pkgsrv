import yargs from 'yargs';
import logger from './logger';
import Koa from 'koa';
import { extname, join } from 'path';
import fs from 'fs';

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

async function stat(path: string): Promise<fs.Stats> {
	return new Promise<fs.Stats>((resolve, reject) => {
		fs.stat(path, (err, stat) => {
			if (err) {
				reject(err);
			} else {
				resolve(stat);
			}
		});
	});
}

app.use(async (ctx) => {
	logger.info('Request');
	const fpath = join(basePath, ctx.path);
	const fstat = await stat(fpath);
	logger.info(`fpath: ${fpath}`);

	if (fstat.isFile()) {
		ctx.type = extname(fpath);
		ctx.body = fs.createReadStream(fpath);
	}
});

app.listen(port);

logger.info(`Listening on port: ${port}`);
logger.info(`Base path: ${basePath}`);

export = {};
