import * as fs from 'node:fs/promises';

(async () => {
    const text = await fs.readFile('sample.json', 'utf8');
    const json = JSON.parse(text) as Record<string, unknown>;
    for (const [key, value] of Object.entries(json)) {
        console.log(key, value);
    }
    console.log(`
    a
    b
    c
    d
    e
    f
    g
    h
    i
    j
    k
    l
    m
    n
    o
    p
    q
    r
    s
    t
    u
    v
    w
    x
    y
    z
    `)
})();
