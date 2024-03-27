function doAsyncA(value, cb) {
  setTimeout(() => {
      console.log("Did something A");
      cb(`${value} + A`);
    }, 500);
}

function doAsyncB(value, cb) {
  setTimeout(() => {
    console.log("Did something B");
    cb(`${value} + B`);
  }, 500);
}

function doAsyncC(value, cb) {
  setTimeout(() => {
    console.log("Did something C");
    cb(`${value} + C`);
  }, 500);
}

doAsyncA("Hey-hey callback, fulfillment value", result => {
  doAsyncB(result, newResult => {
    doAsyncC(newResult, finalResult => {
      console.log(finalResult);
    })
  })
});
