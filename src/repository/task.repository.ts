import { writable } from "svelte/store";
import Task from "../modes/Task";

const store = writable<Task[]>([]);

const _tempTasks: Task[] = [];
for (const keys of Object.keys(localStorage)) {
    if (keys.indexOf("tasks.") == 0) {
        const t = new Task();
        t.fromObj(JSON.parse(localStorage[keys]));
        _tempTasks.push(t)
    }
}

_tempTasks.sort((a, b) => a.date.getTime() - b.date.getTime())
store.set(_tempTasks);

function add(item: Task) {
    store.update((list) => {
        list = [...list, item];
        return list;
    });
    localStorage.setItem(`tasks.${item.id}`, JSON.stringify(item.toObj()));
}

function remove(item: Task) {
    store.update((list) => {
        list = list.filter(task => task.id !== item.id);
        return list;
    })
    localStorage.removeItem(`tasks.${item.id}`);
}

function update(item: Task) {
    store.update((list) => {
        list = list.map(task => {
            if (task.id === item.id)
                return item;

            return task;
        });

        return list;
    });
    localStorage.setItem(`tasks.${item.id}`, JSON.stringify(item.toObj()));
}

function batchUpdate(items: Task[]) {
    // build index

    const _index = {};
    for (const item of items) {
        _index[item.id] = item;
    }

    // Update list in store

    store.update((list) => {
        list = list.map(task => {
            if (task.id in _index)
                return _index[task.id];

            return task;
        });
        return list;
    });

    // Update in localstorage

    for (const item of items) {
        localStorage.setItem(`tasks.${item.id}`, JSON.stringify(item.toObj()));
    }
}

function batchDelete(items: Task[]) {
    // Build index;
    const _index = {};
    for (const item of items) {
        _index[item.id] = true;
    }

    // Update list in store

    store.update((list) => {
        list = list.filter(x => !(x.id in _index));
        return list;
    })

    // Update in localStorage

    for (const item of items) {
        localStorage.removeItem(`tasks.${item.id}`);
    }
}

export default {
    add, remove, update,
    batchUpdate, batchDelete,
    store
}