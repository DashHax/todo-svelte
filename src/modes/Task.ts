export default class Task {
    id: string;
    text: string;
    date: Date;
    completed: boolean;

    constructor() {
        this.id = Math.round(Math.random() * Number.MAX_SAFE_INTEGER).toString(16);
        this.date = new Date();
        this.completed = false;
    }

    toObj() {
        return {
            id: this.id,
            text: this.text,
            date: this.date,
            completed: this.completed
        }
    }

    fromObj(obj) {
        this.id = obj.id;
        this.text = obj.text;
        this.date = new Date(obj.date);
        this.completed = obj.completed;
    }
}