type Generator = <P extends unknown[], R>(
    task: (...args: P) => PromiseLike<R>,
    ...args: P
) => Promise<R>;

// エラーを握りつぶす関数
const squash = () => {};

// インデックスを返す関数
function resultIndex(index: number) {
    return () => index;
}

// 枠を用意する関数
function makeSlots(max: number) {
    return Array.from({ length: max }, (_, i) => Promise.resolve(i));
}

/**
 * 並列同時実行数を制限して非同期関数を実行します。
 * @param maxWorkers 同時実行数の最大値を指定します。
 * @returns 非同期関数を実行する関数を返します。
 */
export function pLimit(maxWorkers: number): Generator {
    // 指定された数だけ枠を用意しておく
    const slots = makeSlots(maxWorkers);
    // 空き枠の検索結果を保持するPromise
    let nextIndex = Promise.resolve(NaN);
    return async (task, ...args) => {
        // 一つ前のタスクでの検索が終わってから、このタスクでの検索を開始する
        nextIndex = nextIndex.then(() => Promise.race(slots));
        // 空き枠の検索
        const index = await nextIndex;
        // タスクを開始
        const promise = task(...args);
        // このtaskが完了したらindexを返すPromiseに差し替える
        slots[index] = Promise.resolve(promise)
            .catch(squash)
            .then(resultIndex(index));
        // taskの返値をそのまま返す
        return promise;
    };
}
