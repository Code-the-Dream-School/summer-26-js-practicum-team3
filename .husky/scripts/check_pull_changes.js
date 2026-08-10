import { execSync } from 'child_process';

try {
  // if git diff-tree has the file names
  // then those files have been changed
  // files changed = true ? generate db client and/or
  // installing node packages:null;
} catch (error) {
  console.log('Error in checking files changed \n', error.message);
  process.exit(1);
}
