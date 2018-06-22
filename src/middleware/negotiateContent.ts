import { Context } from 'koa';
import jstoxml from 'jstoxml';
import logger from '../logger';

const { toXML } = jstoxml;

export default async function negotiateContent(ctx: Context, next: () => Promise<void>): Promise<void> {
	await next();

	if (!ctx.body) {
		return;
	}

	const type = ctx.accepts('json', 'html', 'xml', 'text');
	logger.debug(`negotiateContent type=${type}`);

	switch (type) {
		case false:
			ctx.throw(406);
		case 'json':
			break;
		case 'html':
			ctx.type = 'html';
			ctx.body = `<pre>${JSON.stringify(ctx.body)}</pre>`;
			break;
		case 'xml':
			ctx.type = 'xml';
			ctx.body = toXML(ctx.body);
			break;
		default:
			ctx.type = 'text';
	}
}
