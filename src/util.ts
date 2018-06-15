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
