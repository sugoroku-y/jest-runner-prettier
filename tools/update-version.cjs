const cp = require('child_process');
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- eslintはpackage.jsonからの型取得に対応していない
const { version } = require('../package.json');
const content = fs.readFileSync('README.md', 'utf8');

// README.mdのバージョンを記載しているか所をpackage.jsonのversionに書き換える
const newContent = content.replace(
  new RegExp(
    String.raw`(?<=sugoroku-y/jest-runner-prettier#release/v)\d+\.\d+\.\d+`,
    'g',
  ),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- eslintはpackage.jsonからの型取得に対応していないが、versionはstring型
  version,
);
if (content === newContent) {
  // 変更がなければここで終わり
  process.exit(0);
}
// 変更があれば書き換え
fs.writeFileSync('README.md', newContent, 'utf8');

// README.mdを変更したらコミットしてタグを打ち直す
exec('git', 'add', 'README.md');
exec('git', 'commit', '-m', 'chore: update README.md');
exec('git', 'tag', '-f', `v${version}`);

/**
 * コマンド実行
 * @param {string} command
 * @param  {...string} args
 */
function exec(command, ...args) {
  console.log(
    `CMD: ${command}${args.map((s) => (/[\s"]/.test(s) ? ` "${s}"` : ` ${s}`)).join('')}`,
  );
  const result = cp.spawnSync(command, args, {
    encoding: 'utf8',
    stdio: 'inherit',
  });
  console.log(`CMD RESULT: ${result.status}`);
  if (result.status !== 0) process.exit(1);
}
