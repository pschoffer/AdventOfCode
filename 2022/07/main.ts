const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const TOTAL_SPACE = 70000000;
const REQUIRED_SPACE = 30000000;

const run = async () => {
    // const input = parseInput(inputTestPath);
    const input = parseInput(inputPath);
    calculateSize(input);

    const currentSpace = TOTAL_SPACE - (input!.size || 0);
    const spaceToFree = REQUIRED_SPACE - currentSpace;

    const final = findSmallestFolder(input, spaceToFree);
    console.log(final && final.size)

}

const findSmallestFolder = (folder: Folder, limit: number): Folder | null => {
    let result: Folder | null = null;
    for (const subFolderName in folder.subFolders) {
        const subFolder = folder.subFolders[subFolderName];
        const candidate = findSmallestFolder(subFolder, limit);
        if (candidate && (!result || (candidate.size || 0) < (result.size || 0))) {
            result = candidate;
        }
    }

    if (result) {
        return result;
    }

    if (folder.size && folder.size >= limit) {
        return folder;
    }
    return null;
}


const calculateSize = (folder: Folder) => {
    if (folder.size !== null) {
        return folder.size;
    }

    let size = 0;
    for (const subFolderName in folder.subFolders) {
        const subFolder = folder.subFolders[subFolderName];
        size += calculateSize(subFolder);
    }
    for (const fileName in folder.files) {
        const file = folder.files[fileName];
        size += file.size;
    }
    folder.size = size;
    return size;

}

const parseInput = (inputPath: string) => {
    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines = data.split("\n");

    const rootFolder: Folder = {
        name: '/',
        size: null,
        parentFolder: null,
        subFolders: {},
        files: {}
    };
    let currentFolder: Folder = rootFolder;

    for (let ix = 0; ix < lines.length;) {
        const line = lines[ix];

        const matchCd = line.match(/^\$ cd (.*)/);
        if (matchCd) {
            const folder = matchCd[1];

            if (folder === '/') {
                currentFolder = rootFolder;
            } else if (folder === '..') {
                if (currentFolder.parentFolder) {
                    currentFolder = currentFolder.parentFolder;
                }
            } else {
                currentFolder = currentFolder.subFolders[folder];
            }
            ix++;
            continue;
        }

        const matchLs = line.match(/^\$ ls/);
        if (matchLs) {
            ix++;
            while (ix < lines.length && !lines[ix].match(/^\$/)) {
                const lsLine = lines[ix].match(/^(.*)\s+(.+)$/);
                const sizeOrDir = lsLine[1];
                const name = lsLine[2];

                if (sizeOrDir === 'dir') {
                    currentFolder.subFolders[name] = {
                        name,
                        size: null,
                        parentFolder: currentFolder,
                        subFolders: {},
                        files: {}
                    }
                } else {
                    const size = Number(sizeOrDir);
                    currentFolder.files[name] = {
                        name,
                        size
                    }
                }
                ix++;
            }
            continue;
        }
    }

    return rootFolder;
}

interface FileNode {
    name: string;
    size: number;
}

interface Folder {
    name: string;
    size: null | number;
    parentFolder: Folder | null;
    subFolders: Record<string, Folder>;
    files: Record<string, FileNode>;
}

run();
