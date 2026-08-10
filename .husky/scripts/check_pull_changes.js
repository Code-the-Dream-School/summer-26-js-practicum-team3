import { execSync } from 'child_process';

// if git diff-tree has the file names
// then those files have been changed
// files changed = true ? generate db client and/or
// installing node packages:null;
const GIT_CHANGED_FILES =
  'git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD';
try {
  const changed_files = execSync(GIT_CHANGED_FILES)
    .toString()
    .trim()
    .split('\n');
} catch (error) {
  console.log('Error in checking files changed \n', error.message);
  process.exit(1);
}
