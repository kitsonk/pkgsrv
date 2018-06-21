const { before, describe, it, after } = intern.getInterface('bdd');
const { expect } = intern.getPlugin('chai');

import * as LoggerModule from '../../src/logger';
import * as VersionUtilModule from '../../src/versionUtil';

import { createLogger } from '../mocks/winston';

describe('src/versionUtil', () => {
	let versionUtilModule: typeof VersionUtilModule;
	let loggerModule: typeof LoggerModule;
	let originalLogger: (typeof LoggerModule)['default'];

	before(async () => {
		loggerModule = await import('../../src/logger');
		originalLogger = loggerModule.default;
		loggerModule.default = createLogger();
		versionUtilModule = await import('../../src/versionUtil');
	});

	describe('latestVersion', () => {
		it('should do something', () => {
			expect(versionUtilModule.latestVersion).to.not.be.undefined;
		});
	});

	after(async () => {
		loggerModule.default = originalLogger;
	});
});
