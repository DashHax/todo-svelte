<script lang="ts">
    import { Icon } from "sveltestrap";
    import type Task from "../modes/Task";
    import taskRepository from "../repository/task.repository";

    export let task: Task;

    let checkbox: HTMLInputElement;
    let doneChecked = task.completed;

    function completionChanged() {
        doneChecked = checkbox.checked;
        task.completed = doneChecked;
        taskRepository.update(task);
    }

    function deleteSelf() {
        taskRepository.remove(task);
    }
</script>

<div class="todo-item">
    <div class="form-check todo-text">
        <input
            type="checkbox"
            class="form-check-input"
            id={task.id}
            on:change={completionChanged}
            bind:this={checkbox}
            checked={doneChecked}
        />
        <label
            for={task.id}
            class="form-check-label"
            class:text-decoration-line-through={doneChecked}>{task.text}</label
        >
    </div>
    <button class="btn btn-danger ms-auto" title="Delete" on:click={deleteSelf}>
        <Icon name="trash" />
    </button>
</div>

<style lang="scss">
    .todo-item {
        border: 1px solid #ccc;
        background-color: white;
        border-radius: 0.5rem;
        margin-bottom: 1rem;

        display: flex;

        .todo-text {
            margin: 0.65rem;
        }
    }
</style>
