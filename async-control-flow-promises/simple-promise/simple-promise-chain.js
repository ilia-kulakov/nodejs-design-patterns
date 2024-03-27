const throwError = process.argv[2] == 'error';

function doAsyncA(value) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Did something A");
      resolve(`${value} + A`);
    }, 500);
  });
}

function doAsyncB(value) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Did something B");
      resolve(`${value} + B`);
    }, 500);
  });
}

function doAsyncC(value) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Did something C");
      if(throwError) {
        reject(new Error('An error occured in doAsyncC'));
      }
      resolve(`${value} + C`);
    }, 500);
  });
}

function doSync(value) {
  if(throwError) {
    throw new Error('An error occured in doSync, prev value:' + value);
  }
  return value + ' & Sync';
}

doAsyncA("Hey-hey promise, fulfillment value")
  .then((result) => doAsyncB(result))
  .then((newResult) => doAsyncC(newResult))
  .then(undefined, (error) => {console.error("Empty onFullfilled, onReject: " + error.message); return "err";})
  .then(doSync, (error) => {console.error("onReject: " + error); return "err"})
  .then((result) => console.log(`Eventual Result: ${result}`), (error) => console.error("eventual onReject: " + error))
  .catch(console.error);
