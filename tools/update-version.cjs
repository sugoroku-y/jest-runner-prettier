const cp = require('child_process');
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- eslintはpackage.jsonからの型取得に対応していない
const { version } = require('../package.json');
const content = fs.readFileSync('README.md', 'utf8');
version;
const newContent = content.replace(
  new RegExp(
    String.raw`(?<=sugoroku-y/jest-runner-prettier#release/v)\d+\.\d+\.\d+`,
    'g',
  ),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- eslintはpackage.jsonからの型取得に対応していないが、versionはstring型
  version,
);
if (content === newContent) {
  process.exit(0);
}
fs.writeFileSync('README.md', newContent, 'utf8');
const options = { encoding: 'utf8', stdio: 'inherit' };
let result;
console.log(`CMD: git add README.md`);
result = cp.spawnSync('git', ['add', 'README.md'], options);
console.log(`CMD RESULT: ${result.status}`);
if (result.status !== 0) process.exit(1);
console.log(`CMD: git commit -m 'chore: update README.md'`);
result = cp.spawnSync(
  'git',
  ['commit', '-m', 'chore: update README.md'],
  options,
);
console.log(`CMD RESULT: ${result.status}`);
if (result.status !== 0) process.exit(1);
console.log(`CMD: git tag -f v${version}`);
result = cp.spawnSync('git', ['tag', '-f', `v${version}`], options);
console.log(`CMD RESULT: ${result.status}`);
if (result.status !== 0) process.exit(1);
