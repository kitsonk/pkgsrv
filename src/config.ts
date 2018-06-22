let basePath = __dirname;
let debug = false;

export default {
	get basePath(): string {
		return basePath;
	},

	set basePath(value: string) {
		basePath = value;
	},

	get debug(): boolean {
		return debug;
	},

	set debug(value: boolean) {
		debug = value;
	}
};
