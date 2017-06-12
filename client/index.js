import hamsters from 'hamsters.js';

const ARRAY_LENGTH = 1024 * 1024;

const range = n => Array.from(Array(n).keys());
const max = (a, b) => Math.max(a, b);
const reduceMax = xs => xs.reduce(max, 0);

const doIt = maxThreads => {
    return new Promise(resolve => {
        const start = Date.now();
        const params = {
            ['array']: range(ARRAY_LENGTH)
        };
        hamsters.run(
            params,
            function f1() {
                const max = (a, b) => Math.max(a, b);
                const reduceMax = xs => xs.reduce(max, 0);
                const arr = params['array'];
                // let dummy = 0;
                for (let i = 0; i < arr.length * 10000; i++) {
                    // dummy = i + 1;
                }
                // eslint-disable-next-line no-undef
                rtn.data.push(reduceMax(arr));
            },
            function f2() {
                const result = reduceMax(arguments[0]);
                const end = Date.now();
                log(`[${maxThreads} threads]: result ${result}; elapsed time (ms): ${end - start}`);
                resolve(result);
            },
            maxThreads,
            true
        );
    });
};

const maxThreads = document.getElementById('maxThreads');
const verbose = document.getElementById('verbose');
const init = document.getElementById('init');
const run = document.getElementById('run');
const outputArea = document.getElementById('outputArea');

run.disabled = true;

const log = message => {
    const oldText = outputArea.innerText;
    const sep = oldText.length ? '\n' : '';
    const newText = oldText + sep + message;
    outputArea.innerHTML = newText;
    return Promise.resolve();
};

console.log = log;
console.info = log;

init.addEventListener('click', e => {

    e.preventDefault();

    hamsters.init({
        maxThreads: Number(maxThreads.value),
        debug: verbose.checked ? 'verbose' : false
    });

    // 'hamsters.init' can only be called once.
    maxThreads.disabled = true;
    verbose.disabled = true;
    init.disabled = true;

    run.disabled = false;
});

run.addEventListener('click', e => {

    e.preventDefault();

    log('Starting')
        .then(() => run.disabled = true)
        .then(() => doIt(2))
        .then(() => doIt(4))
        .then(() => doIt(8))
        .then(() => log('Finished\n'))
        .then(() => run.disabled = false);
});
