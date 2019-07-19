export default class Parallel {

    constructor(interval) {
        this.interval = interval;
        this.deferred = null;
        this.promiseStack = new Map();
        this.paused = true;
        this.taskStack = new Map();
    }

    addTask(name, funcInterval, mainFunc, loggingFunc = null) {
        this.taskStack.set(name, {
            funcInterval,
            loggingFunc,
            mainFunc,
            pending: false
        });
        if (this.paused) {
            this.paused = false;
            this.start();
        }

    }

    listenForValue(value, handler, listenerName, interval) {
        let tempVal = value;
        this.addTask(
            listenerName,
            interval,
            () => {
                if (tempVal !== value) {
                    handler.call(this);
                }
                tempVal = value;
            }
        )
    }

    log() {
        return {
            status: this.paused ? 'paused' : 'running',
            interval: this.interval,
            taskStack: this.taskStack,
            promiseStack: this.promiseStack
        }
    }

    removeTask(name) {
        this.taskStack.delete(name);
    }

    start() {
        this.deferred = setInterval(() => {
            this.taskStack.forEach((task, name) => {
                (async () => {
                    if (task.loggingFunc) task.loggingFunc.call(this);
                    if (!task.pending) {
                        task.pending = true;
                        await setTimeout(() => {
                            this.promiseStack.set(name, new Promise((resolve) => {
                                resolve(() => {
                                    task.mainFunc.call(this);
                                    task.pending = false;
                                    this.promiseStack.delete(name);
                                });
                            }));
                            this.promiseStack.get(name).then((func) => {
                                func.call(this);
                            });
                        }, task.funcInterval);
                    }
                })();
            });
        }, this.interval);
    }

    stop() {
        clearInterval(this.deferred);
    }

    reload() {
        this.stop();
        this.start();
    }

    setInterval(interval) {
        this.stop();
        this.interval = interval;
        this.start();
    }
}