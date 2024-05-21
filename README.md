# @sugoroku-y/jest-runner-prettier

an alternative `Prettier runner for Jest` besides [jest-runner-prettier](https://github.com/keplersj/jest-runner-prettier)

[jest-runner-prettier](https://github.com/keplersj/jest-runner-prettier)以外の、もう1つのJest用Prettierランナー

## Usage(使い方)

### Install(インストール)

JESTとPRETTIERがインストールされた環境に`@sugoroku-y/jest-runner-prettier`をインストールします。

```command
npm i -D sugoroku-y/jest-runner-prettier#release/v0.0.0
```

### Add to Jest config(Jestの設定に追加)

#### Using Built-in Preset(ビルトインのプリセットを使用する)

This package includes a Jest preset which configures Jest to run Prettier on all files supported by Prettier. To use it set the following in your `package.json`:

このパッケージには、PrettierがサポートするすべてのファイルでPrettierを実行するようにJestを設定するJestプリセットが含まれています。これを使用するには、`package.json` で以下を設定してください：

```json
{
  "jest": {
    "preset": "@sugoroku-y/jest-runner-prettier"
  }
}
```

or `jest.config.js`:

もしくは`jest.config.js`で以下を設定してください:

```js
module.exports = {
  preset: '@sugoroku-y/jest-runner-prettier',
};
```

#### Manually(手動設定)

In your `package.json`

`package.json`に設定する場合。

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

`jest.config.js`の場合。

```js
module.exports = {
  runner: '@sugoroku-y/jest-runner-prettier',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  testMatch: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.json'],
};
```

### Run Jest(Jestの実行)

```cmd
npx jest
```

## License(使用許諾)

Copyright YEBISUYA Sugoroku 2024. Licensed MIT.
