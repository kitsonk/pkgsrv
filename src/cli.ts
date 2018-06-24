import { join } from 'path';
import yargs from 'yargs';
import { start } from './index';

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

start({
	basePath: argv['b'],
	debug: argv['d'],
	flagLogToFile: argv['l'],
	port: argv['p'],
	subdomain: argv['s'],
	token: argv['t']
});
