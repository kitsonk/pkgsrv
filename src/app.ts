import Koa from 'koa';
import conditional from 'koa-conditional-get';
import etag from 'koa-etag';
import logRequest from './middleware/logRequest';
import router from './router';

// Create app instance
const app = new Koa();

// Setup middleware
app.use(logRequest);
app.use(conditional());
app.use(etag());
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
