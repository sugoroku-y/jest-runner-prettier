import { getSupportInfo } from 'prettier';

/** @type {string[]} */
const moduleFileExtensions = [''];

(async () => {
  const { languages } = await getSupportInfo();
  const extensions = languages.flatMap(({ extensions }) => extensions ?? []);
  moduleFileExtensions.push(...extensions.map((s) => s.slice(1)));
})();

export default {
  displayName: 'prettier',
  runner: '@sugoroku-y/jest-runner-prettier',
  get moduleFileExtensions() {
    return moduleFileExtensions;
  },
  testMatch: ['<rootDir>**/*'],
};
