import { coerce, maxSatisfying, SemVer } from 'semver';

/**
 * Given an array of available versions, return the highest version, or `null` if there
 * are no valid version strings.
 * @param versions An array of version strings
 */
export function maxVersion(versions: string[]): string | null {
	const semver = versions.map((version) => coerce(version)).reduce((previous: SemVer | null, current) => {
		return previous ? (current && current.compare(previous) > 0 ? current : previous) : current;
	}, null);
	return semver ? semver.format() : semver;
}

/**
 * Given an array of available versions and a semver range, return the highest version, or `null` if
 * there are no matches.
 * @param versions An array of version strings
 * @param range The semver range to apply
 */
export function resolveVersion(versions: string[], range: string): string | null {
	return maxSatisfying(versions, range, true);
}
