import { join } from 'path';
import { Stats } from 'fs';
import logger from './logger';
import { readFile, stat } from './util';

export interface Configuration {
	tags: Tags;
}

export interface Tags {
	latest: string;
	[tag: string]: string;
}

const configurationMap = new Map<string, Configuration>();

export async function get(basePath: string, pkg: string): Promise<Configuration | null> {
	logger.verbose(`pkgConfig.get("${basePath}", "${pkg}")`);
	if (configurationMap.has(pkg)) {
		logger.verbose(`Cached config for package: ${pkg}`);
		return configurationMap.get(pkg)!;
	}
	const configFilename = join(basePath, pkg, 'config.json');
	let configStat: Stats;
	try {
		logger.verbose(`stat("${configFilename}")`);
		configStat = await stat(configFilename);
	} catch (e) {
		logger.warn(`No configuration file for package: ${pkg}`);
		return null;
	}
	if (configStat.isFile()) {
		let configJson: string;
		let config: Configuration;
		try {
			configJson = (await readFile(configFilename)).toString('utf8');
			config = JSON.parse(configJson);
		} catch (e) {
			logger.error(`Invalid "config.json": ${e.message}`);
			return null;
		}
		configurationMap.set(pkg, config);
		logger.verbose(`config = ${configJson}`);
		return config;
	} else {
		logger.warn(`"config.json" is not a file for package: ${pkg}`);
	}
	return null;
}
