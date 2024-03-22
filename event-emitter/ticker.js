import { EventEmitter } from "events";

function ticker(number, callback) {
  const period = 50;
  const start = Date.now();
  let prev = start;
  let counter = 0;
  let emitter = new EventEmitter();
  setImmediate(count);

  return emitter;

  function count() {
    const now = Date.now();
    const spentTime = now - start;
    const error = now % 5 == 0 ? `An error occured at time ${now}` : null;
    if (spentTime > number) {
      callback(error, counter, spentTime);      
    } else {
      if(error) {
        emitter.emit("error", error)
      }
      
      counter++;
      let prevDealy = now - prev
      let nextDelay = Math.min(period, 2 * period - prevDealy);
      prev = now;
      emitter.emit("tick", counter, prevDealy, nextDelay);
      setTimeout(count, nextDelay);            
    }
  }
}

ticker(2000, (err, counter, interval) => {
  if(err) {
    console.error(err);
  } else {
    console.log(`Ticker finished, counter: ${counter}, interval: ${interval}`);
  }
})
.on("tick", (counter, prevDelay, nexDelay) => console.log(`Tick N${counter} prevDelay=${prevDelay} nexDelay=${nexDelay}`))
.on("error", (err) => console.error(err))
