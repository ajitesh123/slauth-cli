import { existsSync } from 'fs';
import path from 'path';

export default function isGitRepository(fullPath: string) {
  if (!existsSync(path.join(fullPath, '.git'))) {
    console.log(`${fullPath} is not a Git repository.`);
    return false;
  }
  return true;
}
