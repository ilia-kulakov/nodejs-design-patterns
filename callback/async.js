async function helloAsync (name, callback) {
    process.nextTick(() => callback(`Hello ${name}`));
}

function helloSync (name, callback) {
    callback(`Hello ${name}`);
}

function wrap() {
    console.log("Before function call");
    helloAsync("Async 1", (msg) => console.log(msg));
    helloSync("Sync", (msg) => console.log(msg));
    console.log("After function call");
    helloAsync("Async 2", (msg) => console.log(msg));
}

helloAsync("Before wrap Async", (msg) => console.log(msg));
console.log("Before wrap call");
wrap();
console.log("After wrap call");
helloAsync("After wrap Async", (msg) => console.log(msg));
