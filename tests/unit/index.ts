const { describe, it } = intern.getInterface('bdd');
const { expect } = intern.getPlugin('chai');

describe('src/index', () => {
	it('should do something', () => {
		expect(true === true);
	});
});
