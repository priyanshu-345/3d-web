import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const deleteFile = (filePath) => {
  try {
    const fullPath = path.join(__dirname, '../uploads', filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

export const getFileSize = (filePath) => {
  try {
    const fullPath = path.join(__dirname, '../uploads', filePath);
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      return stats.size;
    }
    return 0;
  } catch (error) {
    console.error('Error getting file size:', error);
    return 0;
  }
};









