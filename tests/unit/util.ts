const { before, beforeEach, describe, it, after } = intern.getInterface('bdd');
const { expect } = intern.getPlugin('chai');

import fs from 'fs';
import { stub, SinonStub } from 'sinon';

import { readdir, readFile, stat } from '../../src/util';

describe('src/util#readdir', () => {
	let stubFsReadir: SinonStub;

	before(() => {
		stubFsReadir = stub(fs, 'readdir');
	});

	beforeEach(() => {
		stubFsReadir.resetBehavior();
		stubFsReadir.resetHistory();
	});

	it('should read a directory, resolving files', async () => {
		stubFsReadir.callsArgWithAsync(2, null, ['foo', 'bar']);
		expect(await readdir('foobar')).to.deep.equal(['foo', 'bar']);
		expect(stubFsReadir).to.have.been.calledWith('foobar', null);
	});

	it('should support passing encoding options', async () => {
		stubFsReadir.callsArgWithAsync(2, null, ['foo', 'bar']);
		const options: { encoding: 'utf8' } = { encoding: 'utf8' };
		expect(await readdir('foobar', options)).to.deep.equal(['foo', 'bar']);
		expect(stubFsReadir).to.have.been.calledWith('foobar', options);
	});

	it('should reject on error', async () => {
		stubFsReadir.callsArgWithAsync(2, { error: 'error' });
		await expect(readdir('foobar')).to.eventually.be.rejected;
		expect(stubFsReadir).to.have.been.calledWith('foobar', null);
	});

	after(() => {
		stubFsReadir.restore();
	});
});

describe('src/util#readFile', () => {
	let stubFsReadFile: SinonStub;

	before(() => {
		stubFsReadFile = stub(fs, 'readFile');
	});

	beforeEach(() => {
		stubFsReadFile.resetBehavior();
		stubFsReadFile.resetHistory();
	});

	it('should read a file, resolving contents', async () => {
		stubFsReadFile.callsArgWithAsync(2, null, Buffer.from('foobarbaz', 'utf8'));
		expect((await readFile('foobar')).toString('utf8')).to.equal('foobarbaz');
		expect(stubFsReadFile).to.have.been.calledWith('foobar', null);
	});

	it('should support passing encoding options', async () => {
		stubFsReadFile.callsArgWithAsync(2, null, 'foobarbaz');
		const options: { encoding: 'utf8' } = { encoding: 'utf8' };
		expect(await readFile('foobar', options)).to.deep.equal('foobarbaz');
		expect(stubFsReadFile).to.have.been.calledWith('foobar', options);
	});

	it('should reject on error', async () => {
		stubFsReadFile.callsArgWithAsync(2, { error: 'error' });
		await expect(readFile('foobar')).to.eventually.be.rejected;
		expect(stubFsReadFile).to.have.been.calledWith('foobar', null);
	});

	after(() => {
		stubFsReadFile.restore();
	});
});

describe('src/util#stat', () => {
	let stubFsStat: SinonStub;

	before(() => {
		stubFsStat = stub(fs, 'stat');
	});

	beforeEach(() => {
		stubFsStat.resetBehavior();
		stubFsStat.resetHistory();
	});

	it('should read a file, resolving contents', async () => {
		stubFsStat.callsArgWithAsync(1, null, 'foobarbaz');
		expect(await stat('foobar')).to.equal('foobarbaz');
		expect(stubFsStat).to.have.been.calledWith('foobar');
	});

	it('should reject on error', async () => {
		stubFsStat.callsArgWithAsync(1, { error: 'error' });
		await expect(stat('foobar')).to.eventually.be.rejected;
		expect(stubFsStat).to.have.been.calledWith('foobar');
	});

	after(() => {
		stubFsStat.restore();
	});
});
