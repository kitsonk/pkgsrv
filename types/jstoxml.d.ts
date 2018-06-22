declare module 'jstoxml' {
	export interface ConfigOptions {
		_selfCloseTag?: boolean;
		attributesFilter?: {
			[key: string]: string;
		};
		header?: boolean | string;
		filter?: {
			[key: string]: string;
		};
		indent?: string;
	}

	const jstoxml: {
		toXML(obj?: object, config?: ConfigOptions): string;
	};

	export default jstoxml;
}
