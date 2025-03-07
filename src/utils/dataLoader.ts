import path from 'path';
import fs from 'fs';
import { Beast } from '@/types';

export let beastData: Record<string, Beast> = {};

// Load data and transform it into a key-value object
export const loadData = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const beastDataPath = path.join('./data', 'beast.json');

    fs.readFile(beastDataPath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading JSON file:', err);
        reject(err);
        return;
      }

      try {
        const beastObject: Record<string, Beast> = JSON.parse(data);

        if (typeof beastObject !== 'object' || Array.isArray(beastObject)) {
          throw new Error('Invalid JSON format: Expected an object with beast names as keys.');
        }

        beastData = beastObject;
        resolve();
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        reject(parseError);
      }
    });
  });
};
