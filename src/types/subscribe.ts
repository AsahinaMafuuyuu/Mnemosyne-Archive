interface EventSubscriber {
    on: (name:string, callback: Function) => void, // 订阅事件
    emit: (name:string, ...args: any[]) => void, // 发布事件
    once: (name:string, callback: Function) => void, // 订阅一次性事件
    off: (name:string, callback: Function) => void // 取消订阅事件
}

interface EventList {
    [key: string]: Array<Function>
}

class Dispatcher implements EventSubscriber {
    private events: EventList = {};

    // 订阅事件
    on(name: string, callback: Function) {
        // 首先取得原来事件列表
        const callbacks = this.events[name] || [];
        // 将新的回调函数添加到事件列表中
        callbacks.push(callback);
        // 更新事件列表
        this.events[name] = callbacks;
    }

    // 发布事件
    emit(name: string, ...args: any[]) {
        // 取得事件列表
        const callbacks = this.events[name];
        if (callbacks) {
            // 依次调用事件列表中的回调函数
            callbacks.forEach(callback => callback(...args));
        }
        else {
            throw new Error(`Event ${name} does not exist.`);
        }
    }

    // 订阅一次性事件
    // 实现也很简单，将原来的回调函数包装成一个新的函数，在调用原来回调函数后取消订阅事件
    once(name: string, callback: Function) {
        const onceCallback = (...args: any[]) => {
            callback(...args);
            this.off(name, onceCallback);
        }
        this.on(name, onceCallback);
    }

    // 取消订阅事件
    off(name: string, callback: Function) {
        const callbacks = this.events[name];
        if (callbacks && callback) {
            // 从事件列表中移除指定的回调函数
            this.events[name] = callbacks.filter(cb => cb !== callback);
        }
    }
}

const audio_entity = new Dispatcher();

const callback = (msg: string) => {
    console.log(`Received message: ${msg}`);
};

audio_entity.on('test', callback);
audio_entity.emit('test', 'Hello, World!'); // 输出: Received message: Hello, World!

audio_entity.once('testOnce', (msg: string) => {   
    console.log(`Received message: ${msg}`);
});
audio_entity.emit('testOnce', 'Hello, Once!');
audio_entity.emit('testOnce', 'Hello, Once Again!'); // 不会输出任何内容，因为事件已经被取消订阅了
audio_entity.off('test', callback);
audio_entity.emit('test', 'Hello, World!'); // 不会输出任何内容，因为事件已经被取消订阅了