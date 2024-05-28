// エラーを握りつぶす関数
const squash = () => { };
// インデックスを返す関数
function resultIndex(index) {
    return () => index;
}
// 枠を用意する関数
function makeSlots(max) {
    return Array.from({ length: max }, (_, i) => Promise.resolve(i));
}
export function pLimit(maxWorkers) {
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
//# sourceMappingURL=p-limit.js.map