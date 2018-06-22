import Router from 'koa-router';
import versions from './api/versions';
import negotiateContent from './middleware/negotiateContent';
import fetchModule from './fetchModule';

const router = new Router();
const apiVersions = new Router();

apiVersions.get('/@:ns/:pkg', versions).get('/:pkg', versions);

router
	.get('/', async (ctx) => {
		ctx.body = { hello: 'world' };
	})
	.use('/api*', negotiateContent)
	.use('/api/versions', apiVersions.routes(), apiVersions.allowedMethods())
	.get('/@:ns/:pkg/:mid*', fetchModule)
	.get('/:pkg/:mid*', fetchModule);

export default router;
