const cp = require('child_process');
// eslint-disable-next-line @typescript-eslint/unbound-method -- --
const { resolve } = require('path');
const jest = resolve('node_modules/jest/bin/jest.js');
process.chdir(__dirname);
cp.spawnSync('node', ['--experimental-vm-modules', jest], {
    encoding: 'utf8',
    stdio: 'inherit',
});
