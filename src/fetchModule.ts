import { createReadStream } from 'fs';
import { Context } from 'koa';
import { extname, join } from 'path';
import config from './config';
import logger from './logger';
import { get } from './pkgConfig';
import { stat } from './util';
import { getVersions, latestVersion, maxVersion, resolveVersion } from './versionUtil';

interface Params {
	mid: string;
	ns?: string;
	pkg: string;
}

/**
 * Based on the requested module, resolve it and stream it in the response
 * @param ctx Context provided to the middleware
 * @param next The next function in the the middleware
 */
export default async function fetchModule(ctx: Context): Promise<void> {
	const {
		params: { pkg, ns, mid }
	}: { params: Params } = ctx;
	const { basePath, debug } = config;
	logger.debug(`fetchMode: pkg=${pkg} ns=${ns} module=${mid}`);
	const [pkgId, pkgSemverOrTag] = pkg.split('@') as [string, string | undefined];
	const pkgName = ns ? join(`@${ns}`, pkgId) : pkgId;
	const availableVersions = await getVersions(join(basePath, pkgName));
	ctx.assert(availableVersions.length, 404);
	const pkgConfig = await get(basePath, pkgName);
	const version = pkgSemverOrTag
		? resolveVersion(availableVersions, pkgConfig && pkgConfig.tags, pkgSemverOrTag)
		: pkgConfig
			? latestVersion(availableVersions, pkgConfig.tags)
			: maxVersion(availableVersions);
	if (debug) {
		logger.debug(
			`resolved version: ${version} ` +
				`pkgSemverOrTag=${pkgSemverOrTag} ` +
				`avail versions=${JSON.stringify(availableVersions)}`
		);
	}
	ctx.assert(version, 400);
	const modulePath = join(basePath, pkgName, version!, ...mid.split('/'));
	logger.debug(`Resolved path: ${modulePath}`);
	const moduleStat = await stat(modulePath);

	if (moduleStat.isFile()) {
		ctx.type = extname(modulePath);
		ctx.body = createReadStream(modulePath);
	}
}
