import { execSync } from 'child_process';

const GIT_CHANGED_FILES =
  'git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD';
try {
  const changed_files = execSync(GIT_CHANGED_FILES)
    .toString()
    .trim()
    .split('\n');

  if (changed_files.includes('backend/prisma/schema.prisma')) {
    console.log('Schema has apeared to\n change, generating new db client');
    execSync('npm run db:generate', { stdio: 'inherit' });
    console.log('Finished generating DB client');
  }
  if (changed_files.includes('backend/package.json')) {
    console.log('Backend package.json is updating...');
    execSync('npm install');
    console.log('Finished updating backend server');
  }
  if (changed_files.includes('frontend/package.json')) {
    console.log('Front package.json is updating...');
    execSync('npm install');
    console.log('Finished updating frontend server');
  }
} catch (error) {
  console.log('Error in checking files changed \n', error.message);
  process.exit(1);
}
