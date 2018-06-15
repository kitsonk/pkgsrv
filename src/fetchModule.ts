import { createReadStream } from 'fs';
import { Context } from 'koa';
import { extname, join } from 'path';
import logger from './logger';
import { readdir, stat } from './util';
import { maxVersion, resolveVersion } from './versionUtil';

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
 * Create middleware that resolves a module
 * @param basePath The base path to resolve requests from
 */
export function create(basePath: string) {
	/**
	 * Attempts to resolve a module based on the requested path
	 * @param ctx The context passed to the middleware
	 */
	async function fetchModule(ctx: Context) {
		const splitPath = ctx.path.split('/');
		ctx.assert(splitPath.length > 2 && splitPath[0] === '', 400);
		const [, requestedPackage, ...moduleArray] = splitPath;
		const moduleName = moduleArray.join('/');
		const [pkgName, pkgSemver] = requestedPackage.split('@');
		const availableVersions = await getVersions(join(basePath, pkgName));
		ctx.assert(availableVersions.length, 404);
		const version = pkgSemver ? resolveVersion(availableVersions, pkgSemver) : maxVersion(availableVersions);
		ctx.assert(version, 400);
		const fpath = join(basePath, pkgName, version!, moduleName);
		logger.info(`Resolved path: ${fpath}`);
		const fstat = await stat(fpath);

		if (fstat.isFile()) {
			ctx.type = extname(fpath);
			ctx.body = createReadStream(fpath);
		}
	}

	return fetchModule;
}
