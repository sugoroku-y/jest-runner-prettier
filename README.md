# @sugoroku-y/jest-runner-prettier

an alternative `Prettier runner for Jest` besides [jest-runner-prettier](https://github.com/keplersj/jest-runner-prettier)

> [jest-runner-prettier](https://github.com/keplersj/jest-runner-prettier)以外の、もう1つのJest用Prettierランナー

## Difference from [jest-runner-prettier](https://github.com/keplersj/jest-runner-prettier)(違うところ)

The differences from [jest-runner-prettier](https://github.com/keplersj/jest-runner-prettier) are as follows:

> [jest-runner-prettier](https://github.com/keplersj/jest-runner-prettier)と違う点は以下のとおりです。

- The Issue [Prettier APIs went async as of Prettier 3.0.0](https://github.com/keplersj/jest-runner-prettier/issues/586) has been resolved.

  When used with Prettier 3.0.0 or later, [jest-runner-prettier](https://github.com/keplersj/jest-runner-prettier) did not report any format omissions.

  > [Prettier APIs went async as of Prettier 3.0.0](https://github.com/keplersj/jest-runner-prettier/issues/586)の問題を解消しています。
  >
  > Prettier 3.0.0以降と併用すると[jest-runner-prettier](https://github.com/keplersj/jest-runner-prettier)ではフォーマット漏れがあっても報告されませんでした。

- If you have a `.gitignore` or `.prettierignore`, the files described in it are excluded from the inspection.

  It is not necessary to specify files not subject to formatting in both `jest.config.js` and `.prettierignore`.

  > `.gitignore`や`.prettierignore`があれば、そこに書かれているファイルを検査対象から除外します。
  >
  > `jest.config.js`と`.prettierignore`の両方にフォーマット対象外のファイルを指定する必要はありません。

- If any files are not formatted by Prettier, the differences are displayed.

  > Prettierによってフォーマットされていないファイルがあれば、差分を表示します。

- Some items can be customized according to the settings described in `jest-runner-prettier.config.js`.

  > `jest-runner-prettier.config.js`に記述した設定内容によってカスタマイズできる項目があります。

## Usage(使い方)

### Install(インストール)

Install jest, prettier and `@sugoroku-y/jest-runner-prettier`.

> jest、prettierと`@sugoroku-y/jest-runner-prettier`をインストールします。

```command
npm i -D jest prettier sugoroku-y/jest-runner-prettier
```

### Add to Jest config(Jestの設定に追加)

#### Using Built-in Preset(ビルトインのプリセットを使用する)

This package includes a Jest preset which configures Jest to run Prettier on all files supported by Prettier. To use it set the following in your `package.json`:

> このパッケージには、PrettierがサポートするすべてのファイルでPrettierを実行するようにJestを設定するJestプリセットが含まれています。これを使用するには、`package.json` で以下を設定してください：

```json
{
  "jest": {
    "preset": "@sugoroku-y/jest-runner-prettier"
  }
}
```

or `jest.config.js`:

> もしくは`jest.config.js`で以下を設定してください:

```js
module.exports = {
  preset: '@sugoroku-y/jest-runner-prettier',
};
```

If you are already using Prettier and have already set up `.prettierrc` and `.prettierignore`, this is recommended. You only need to set `preset` and nothing else.

> すでにPrettierを使用していて`.prettierrc`や`.prettierignore`などの設定が済んでいる場合はこちらを推奨します。`preset`の設定だけでほかの指定は不要です。

#### Manually(手動設定)

In your `package.json`

> `package.json`に設定する場合。

```json
{
  "jest": {
    "runner": "@sugoroku-y/jest-runner-prettier",
    "moduleFileExtensions": ["js", "jsx", "ts", "tsx", "json"],
    "testMatch": ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx", "**/*.json"]
  }
}
```

Or in `jest.config.js`

> `jest.config.js`の場合。

```js
module.exports = {
  runner: '@sugoroku-y/jest-runner-prettier',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  testMatch: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.json'],
};
```

It should be sufficient to specify settings such as `moduleFileExtensions` and `testMatch` with `preset`, but if for some reason that is not sufficient, specify them here.

> `moduleFileExtensions`や`testMatch`などの設定は`preset`で指定していれば十分であるはずですが、何らかの事情によりそれでは足りない場合にこちらで指定します。

### Run Jest(Jestの実行)

```cmd
npx jest
```

Then prepare `.prettierrc`, `.prettierignore`, etc. as required.

> あとは必要に応じて`.prettierrc`や`.prettierignore`などを用意してください。

## License(使用許諾)

Copyright YEBISUYA Sugoroku 2024. Licensed MIT.
