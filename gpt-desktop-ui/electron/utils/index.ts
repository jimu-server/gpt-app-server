import fs from "fs";

/**
 * Get the subdirectories of a specified directory.
 * @param {string} dirPath - The path of the directory.
 * @returns {Promise<string[]>} - A promise that resolves to an array of subdirectory names.
 */
export function getSubdirectories(dirPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(dirPath, {withFileTypes: true}, (err, files) => {
            if (err) {
                return reject(err);
            }
            let map = files.filter(item => {
                return !item.name.endsWith(".tmp");
            }).map(item => {
                let directory = item.isDirectory();
                return {
                    ...item,
                    isDirectory: directory
                }
            });
            resolve(map);
        });
    });
}


export function readFiles(list: string[]) {
    return list.map(item => {
        return fs.createReadStream(item)
    })
}
