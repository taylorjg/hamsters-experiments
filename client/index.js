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
                const busyWait = iterations => { for (let i = 0; i < iterations * 10000; i++); };
                const arr = params['array'];
                busyWait(arr.length);
                rtn.data.push(reduceMax(arr)); // eslint-disable-line no-undef
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
const spinner = document.getElementById('spinner');
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

const showSpinner = () => spinner.className = 'show';
const hideSpinner = () => spinner.className = 'hide';

const start = () => {
    log('Starting');
    showSpinner();
    run.disabled = true;
    return Promise.resolve();
};

const finish = () => {
    log('Finished\n');
    hideSpinner();
    run.disabled = false;
};

run.addEventListener('click', e => {
    e.preventDefault();
    start()
        .then(() => doIt(2))
        .then(() => doIt(4))
        .then(() => doIt(8))
        .then(finish);
});
