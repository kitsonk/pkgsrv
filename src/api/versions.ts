import { Context } from 'koa';
import { join } from 'path';
import config from '../config';
import logger from '../logger';
import { getVersions } from '../versionUtil';

interface Params {
	ns?: string;
	pkg: string;
}

export default async function versions(ctx: Context): Promise<void> {
	const {
		params: { ns, pkg }
	}: { params: Params } = ctx;
	const { basePath } = config;
	logger.debug(`versions ns=${ns} pkg=${pkg}`);
	const path = ns ? join(basePath, `@${ns}`, pkg) : join(basePath, pkg);
	const versions = await getVersions(path);
	ctx.assert(versions.length, 404);
	ctx.body = versions;
}
