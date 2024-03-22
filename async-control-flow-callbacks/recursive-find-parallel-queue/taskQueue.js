import { EventEmitter } from "events";

export class TaskQueue extends EventEmitter {
  constructor(concurrency) {
    super();
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
    this.cumulativeResult = [];
  }

  pushTask(task) {
    this.queue.push(task);
    process.nextTick(this.next.bind(this));
    return this;
  }

  next() {
    if (this.running === 0 && this.queue.length === 0) {
      this.emit("empty", this.cumulativeResult);
    }

    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift();
      task((err, result) => {
        if (err) {
          this.emit("error", err);
        }

        if(!result) {
          return;
        }

        this.cumulativeResult = this.cumulativeResult.concat(result);
        this.running--;
        process.nextTick(this.next.bind(this));
      });
      this.running++;
    }
  }
}
