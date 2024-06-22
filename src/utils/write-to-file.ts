import { mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export default async function writeToFile(filePath: string, contents: string) {
  if (!existsSync(filePath)) {
    const directoryName = path.dirname(filePath);
    await mkdir(directoryName, { recursive: true });
  }
  await writeFile(filePath, contents);

  await writeFile(filePath, contents);
}
