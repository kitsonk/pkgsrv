import { createReadStream } from 'fs';
import { Context } from 'koa';
import { extname, join } from 'path';
import logger from './logger';
import { get } from './pkgConfig';
import { readdir, stat } from './util';
import { latestVersion, maxVersion, resolveVersion } from './versionUtil';

interface Params {
	module: string;
	ns?: string;
	pkg: string;
}

let basePath = __dirname;

/**
 * Helper function to stat a path and determine if it is a directory
 * @param path The path to determine if it is a directory
 */
async function isDirectory(path: string): Promise<boolean> {
	return (await stat(path)).isDirectory();
}

/**
 * Resolve to an array of semantic versions of a package from the file system
 * @param path The path of which to return the version sub directories
 */
async function getVersions(path: string): Promise<string[]> {
	let files: string[] = [];
	try {
		files = await readdir(path);
	} catch (e) {
		logger.error(`No such file or directory: ${path}`);
	}
	const directories: string[] = [];
	for (let i = 0; i < files.length; i++) {
		if (await isDirectory(join(path, files[i]))) {
			directories.push(files[i]);
		}
	}
	return directories;
}

/**
 * Set the base path to use when resolving modules
 * @param value The value to set the base path to
 */
export function setBasePath(value: string): void {
	basePath = value;
}

/**
 * Based on the requested module, resolve it and stream it in the response
 * @param ctx Context provided to the middleware
 * @param next The next function in the the middleware
 */
export default async function fetchModule(ctx: Context, next: () => Promise<void>) {
	const {
		params: { pkg, ns, module: mid }
	}: { params: Params } = ctx;
	logger.debug(`fetchMode: pkg=${pkg} ns=${ns} module=${mid}`);
	const [pkgId, pkgSemverOrTag] = pkg.split('@') as [string, string | undefined];
	const pkgName = ns ? join(`@${ns}`, pkgId) : pkgId;
	const availableVersions = await getVersions(join(basePath, pkgName));
	ctx.assert(availableVersions.length, 404);
	const config = await get(basePath, pkgName);
	const version = pkgSemverOrTag
		? resolveVersion(availableVersions, config && config.tags, pkgSemverOrTag)
		: config
			? latestVersion(availableVersions, config.tags)
			: maxVersion(availableVersions);
	logger.debug(
		`resolved version: ${version} ` +
			`pkgSemverOrTag=${pkgSemverOrTag} ` +
			`avail versions=${JSON.stringify(availableVersions)}`
	);
	ctx.assert(version, 400);
	const modulePath = join(basePath, pkgName, version!, ...mid.split('/'));
	logger.debug(`Resolved path: ${modulePath}`);
	const moduleStat = await stat(modulePath);

	if (moduleStat.isFile()) {
		ctx.type = extname(modulePath);
		ctx.body = createReadStream(modulePath);
	}
}
