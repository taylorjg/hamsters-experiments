import hamsters from 'hamsters.js';

const ARRAY_LENGTH = 1024 * 1024;

const range = (start, len) => Array.from(Array(len).keys()).map(n => n + start);
const max = (a, b) => Math.max(a, b);
const reduceMax = xs => xs.reduce(max, 0);

const startOptions = {
    // debug: 'verbose'
    maxThreads: 8,
};
hamsters.init(startOptions);

var params = {
    ['array']: range(0, ARRAY_LENGTH)
};

const doIt = maxThreads => {
    const timerName = `timer-${maxThreads}`;
    return new Promise((resolve, reject) => {
        console.time(timerName);
        hamsters.run(
            params,
            function f1() {
                const max = (a, b) => Math.max(a, b);
                const reduceMax = xs => xs.reduce(max, 0);
                const arr = params['array'];
                let dummy = 0;
                for (let i = 0; i < arr.length * 10000; i++) {
                    dummy = i + 1;
                }
                rtn.data.push(reduceMax(arr));
            },
            function f2() {
                const result = reduceMax(arguments[0]);
                console.log(`result (${maxThreads}): ${result}`);
                console.timeEnd(timerName);
                resolve(result);
            },
            maxThreads,
            true
        );
    });
};

doIt(2)
    .then(() => doIt(4))
    .then(() => doIt(8));
