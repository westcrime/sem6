import { constants } from 'fs';
import fs from 'fs/promises';

async function getFilesInDirectory(directoryPath: string) {
    try {
        const files = await fs.readdir(directoryPath);
        return files;
    } catch (error) {
        console.error('Error reading directory:', error);
    }
}

async function exists(filePath: string) {
    try {
        await fs.access(filePath, constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

export { exists, getFilesInDirectory };