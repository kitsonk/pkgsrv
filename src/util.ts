import fs from 'fs';

export async function readdir(
	path: string,
	options: { encoding: BufferEncoding | null } | BufferEncoding | undefined | null = null
): Promise<string[]> {
	return new Promise<string[]>((resolve, reject) => {
		fs.readdir(path, options, (err, files) => {
			if (err) {
				reject(err);
			} else {
				resolve(files);
			}
		});
	});
}

export async function readFile(path: string, options?: { encoding?: null; flag?: string } | null): Promise<Buffer>;
export async function readFile(path: string, options: { encoding?: string; flag?: string } | string): Promise<string>;
export async function readFile(
	path: string,
	options: { encoding?: null | string; flag?: string } | string | undefined | null = null
): Promise<Buffer | string> {
	return new Promise<Buffer | string>((resolve, reject) => {
		fs.readFile(path, options, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}

export async function stat(path: string): Promise<fs.Stats> {
	return new Promise<fs.Stats>((resolve, reject) => {
		fs.stat(path, (err, stat) => {
			if (err) {
				reject(err);
			} else {
				resolve(stat);
			}
		});
	});
}
