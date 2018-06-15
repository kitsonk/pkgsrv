import { Context } from 'koa';
import logger from './logger';

/**
 * Logs requests, providing the method, url and time in milliseconds to handle the request
 * @param ctx Context passed to the middleware
 * @param next The next process in the middleware chain
 */
async function logRequest(ctx: Context, next: () => Promise<any>) {
	const start = Date.now();
	await next();
	logger.info(`${ctx.method} ${ctx.url} - ${Date.now() - start}`);
}

export default logRequest;
