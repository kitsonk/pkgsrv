import { coerce, maxSatisfying, SemVer } from 'semver';
import logger from './logger';
import { Tags } from './pkgConfig';

/**
 * Return the latest version based on the provided tags or return `null`
 * @param versions An array of version strings
 * @param tags An object of tags with versions
 */
export function latestVersion(versions: string[], tags: Tags): string | null {
	const version = versions.includes(tags.latest) ? tags.latest : null;
	if (!version) {
		logger.error(
			`Latest version not available: ` + `versions="${versions.toString()}" ` + `latest="${tags.latest}"`
		);
	}
	return version;
}

/**
 * Given an array of available versions, return the highest version, or `null` if there
 * are no valid version strings.
 * @param versions An array of version strings
 */
export function maxVersion(versions: string[]): string | null {
	const semver = versions.map((version) => coerce(version)).reduce((previous: SemVer | null, current) => {
		return previous ? (current && current.compare(previous) > 0 ? current : previous) : current;
	}, null);
	if (!semver) {
		logger.error(`Max version not available: versions="${versions.toString()}"`);
	}
	return semver ? semver.format() : semver;
}

/**
 * Given an array of available versions and a semver range, return the highest version, or `null` if
 * there are no matches.
 * @param versions An array of version strings
 * @param range The semver range to apply
 */
export function resolveVersion(versions: string[], tags: Tags | null, rangeOrTag: string): string | null {
	const range = coerce(rangeOrTag);
	if (range) {
		return maxSatisfying(versions, rangeOrTag);
	}
	if (tags && rangeOrTag in tags && versions.includes(tags[rangeOrTag])) {
		return tags[rangeOrTag];
	}
	logger.warn(
		'Cannot resolve version from: ' +
			`versions="${versions.toString()}" ` +
			`tags=${tags ? `"${Object.keys(tags).toString()}"` : 'null'} ` +
			`rangeOrTag="${rangeOrTag}"`
	);
	return null;
}
