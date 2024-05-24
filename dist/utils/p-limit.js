// 空いている枠を検索するための関数
const vacancy = (e) => !e;
export function pLimit(maxWorkers) {
    // 指定された数だけ枠を用意しておく
    const tasks = Array(maxWorkers);
    // 枠が全部埋まっていたら空くまで待つための関数
    const race = () => Promise
        // どれか1つでも完了/エラーで終了するまで待つ
        .race(tasks)
        // エラーで終了の場合でも握りつぶす
        .catch(() => 0);
    // 一つ前のタスクでの検索
    let racing = Promise.resolve();
    return async (task, ...args) => {
        let found;
        // 空いている枠の検索
        while ((found = tasks.findIndex(vacancy)) === -1) {
            // 一つ前のタスクでの検索が終わってから、このタスクでの検索を開始する
            racing = racing.then(race);
            await racing;
        }
        try {
            // タスクを開始
            const promise = task(...args);
            // タスクを開始したので枠をこのタスクで埋めておく
            tasks[found] = promise;
            // 完了まで待ってから返値を返す
            return await promise;
        }
        finally {
            // タスクが完了したら枠を空ける
            delete tasks[found];
        }
    };
}
//# sourceMappingURL=p-limit.js.map