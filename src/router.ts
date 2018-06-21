import Router from 'koa-router';
import fetchModule, { setBasePath as fetchModuleSetBasePath } from './fetchModule';

export function setBasePath(value: string): void {
	fetchModuleSetBasePath(value);
}

const router = new Router();

router
	.get('/', async (ctx) => {
		ctx.body = 'Hello World!';
	})
	.get('/api/:command*', async (ctx) => {
		ctx.body = JSON.stringify(ctx.params);
	})
	.get('/@:ns/:pkg/:module*', fetchModule)
	.get('/:pkg/:module*', fetchModule);

export default router;
