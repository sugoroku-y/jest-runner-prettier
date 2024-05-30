import { cosmiconfig } from 'cosmiconfig';
import { ensureConfig } from '../utils/ensureConfig.js';

/**
 * Prettier実行時のカスタマイズ項目を格納するinterface
 */
export interface RunnerConfig {
    /**
     * from [Prettier CLI --config](https://prettier.io/docs/en/cli#--find-config-path-and---config)
     *
     * You can also use --config if your configuration file lives somewhere where Prettier cannot find it, such as a config/ directory.
     *
     * If you don’t have a configuration file, or want to ignore it if it does exist, you can pass --no-config instead.
     *
     * > 設定ファイルがconfig/ディレクトリなど、Prettierが見つけられない場所にある場合は、`--config`を使うこともできます。
     * >
     * > 設定ファイルが存在しない場合や、存在しても無視したい場合は、代わりに`--no-config`を渡すことができます。
     *
     * **for jest-runner-prettier**
     *
     * If set string, as same as `--config /path/to/file`.
     *
     * If set `null`, as same as `--no-config`.
     *
     * > 文字列を指定した場合は、`--config /path/to/file`と同じになります。
     * >
     * > `null`を指定した場合は、`--no-config`と同じになります。
     */
    config?: string | null;
    /**
     * from [Prettier CLI --cache](https://prettier.io/docs/en/cli#--cache)
     *
     * If this option is enabled, the following values are used as cache keys and the file is formatted only if one of them is changed.
     *
     * (omit)
     *
     * Running Prettier without `--cache` will delete the cache.
     *
     * > このオプションを有効にすると、以下の値がキャッシュ・キーとして使用され、そのうちの1つが変更された場合にのみファイルがフォーマットされます。
     * >
     * > (略)
     * >
     * > Prettierを`--cache`なしで実行すると、キャッシュが削除されます。
     */
    useCache?: boolean;
    /**
     * from [Prettier CLI --no-editorconfig](https://prettier.io/docs/en/cli#--no-editorconfig)
     *
     * Don’t take `.editorconfig` into account when parsing configuration.
     * See the [`prettier.resolveConfig` docs](https://prettier.io/docs/en/api#prettierresolveconfigfilefileurlorpath) for details.
     *
     * > 設定をパースする際に `.editorconfig` を考慮しません。詳細は[`prettier.resolveConfig`のドキュメント](https://prettier.io/docs/en/api#prettierresolveconfigfilefileurlorpath)を参照してください。
     *
     * **for jest-runner-prettier**
     *
     * If set `false`, as same as `--no-editorconfig`.
     *
     * > `false`を指定すると、`--no-editorconfig`と同じになります。
     */
    editorconfig: boolean;

    /**
     * from [Prettier CLI --ignore-path](https://prettier.io/docs/en/cli#--ignore-path)
     *
     * Path to a file containing patterns that describe files to ignore. By default,
     * Prettier looks for ./.gitignore and ./.prettierignore.
     *
     * > 無視するファイルを記述するパターンを持つファイルへのパス。デフォルトでは、
     * > Prettierは./.gitignoreと./.prettierignoreを参照します。
     */
    ignorePath: string[] | string;
    /**
     * from [Prettier CLI --with-node-modules](https://prettier.io/docs/en/cli#--with-node-modules)
     *
     * Prettier CLI will ignore files located in node_modules directory.
     * To opt out from this behavior, use --with-node-modules flag.
     *
     * > Prettier CLI は node_modules ディレクトリにあるファイルを無視します。
     * > この動作を無効にするには、--with-node-modules フラグを使用します。
     */
    withNodeModules?: boolean;
    /**
     * from [Prettier Plugin](https://prettier.io/docs/en/plugins)
     *
     * Plugins are ways of adding new languages or formatting rules to Prettier.
     * Prettier’s own implementations of all languages are expressed using the plugin API.
     * The core prettier package contains JavaScript and other web-focused languages built in.
     * For additional languages you’ll need to install a plugin.
     *
     * > プラグインとは、Prettierに新しい言語や書式規則を追加する方法です。
     * > すべての言語のPrettier独自の実装は、プラグインAPIを使って表現されます。
     * > prettierのコアパッケージには、JavaScriptやその他のウェブに特化した言語が組み込まれています。
     * > 追加の言語については、プラグインをインストールする必要があります。
     *
     * Strings provided to plugins are ultimately passed to import() expression,
     * so you can provide a module/package name, a path, or anything else import() takes.
     *
     * > プラグインに提供された文字列は、最終的にimport()式に渡されるので、
     * > モジュール/パッケージ名やパス、その他import()が受け取るものを指定することができます。
     */
    plugins?: Array<string>;

    /** 差分表示のための設定 */
    diff: {
        /**
         * 一致している行を展開して(省略しないで)表示する場合にはtrueを指定します。
         * @default false
         */
        expand: boolean;
        /**
         * 差分の前後にある一致している行を何行表示するかを指定します。
         * @default 2
         */
        contextLines: number;
        /**
         * 差分がこの設定値を超える行数存在していた場合、以降の表示を省略します。
         * @default 20
         */
        thresholdForOmitting: number | 'Infinity';
    };
}

const DEFAULT_CONFIG: RunnerConfig = {
    ignorePath: ['.gitignore', '.prettierignore'],
    editorconfig: true,
    diff: {
        expand: false,
        contextLines: 2,
        thresholdForOmitting: 20,
    },
};

/**
 * Prettier実行時のカスタマイズ項目を読み込みます。
 * @param rootDir プロジェクトのルート
 * @returns カスタマイズ項目
 */
export async function loadRunnerConfig(rootDir: string): Promise<RunnerConfig> {
    const cc = cosmiconfig('jest-runner-prettier');
    const result = await cc.search(rootDir);
    return ensureConfig(result?.config, DEFAULT_CONFIG);
}
