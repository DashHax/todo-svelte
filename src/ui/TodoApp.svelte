<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import type { Unsubscriber } from "svelte/store";

    import TodoPoster from "./TodoPoster.svelte";
    import taskRepository from "../repository/task.repository";
    import Task from "../modes/Task";
    import TodoItem from "./TodoItem.svelte";

    let isLoadingTask = false;
    let disablePoster = false;
    let text: string = "";
    let tasks: Task[] = [];
    let viewTasks: Task[] = [];

    let viewType = 0;
    let unsubTask: Unsubscriber;

    $: remainingTasks = tasks.filter((task) => task.completed == false).length;

    async function onPost() {
        disablePoster = true;

        const newTask = new Task();
        newTask.text = text;

        taskRepository.add(newTask);
        text = "";

        disablePoster = false;
    }

    function changeView() {
        const view = parseInt(this.dataset.view);
        viewType = view;

        switch (viewType) {
            case 0:
                viewTasks = tasks;
                break;
            case 1:
                viewTasks = tasks.filter((task) => task.completed == false);
                break;
            case 2:
                viewTasks = tasks.filter((task) => task.completed == true);
                break;
        }
    }

    function performAction() {
        const action = this.dataset.action;
        let newTask;

        switch (action) {
            case "mac": //Mark all complete
                isLoadingTask = true;

                newTask = tasks.map((x) => {
                    x.completed = true;
                    return x;
                });

                taskRepository.batchUpdate(newTask);

                tasks = newTask;
                viewTasks = tasks;
                break;
            case "mau": //Mark all incomplete
                isLoadingTask = true;

                newTask = tasks.map((x) => {
                    x.completed = false;
                    return x;
                });

                taskRepository.batchUpdate(newTask);
                tasks = newTask;
                viewTasks = tasks;

                break;
            case "dac":
                if (
                    !confirm(
                        "Confirm deleting all completed task? This action is irreversible."
                    )
                )
                    return;
                isLoadingTask = true;
                const deletedTasks = tasks.filter((item) => item.completed);
                taskRepository.batchDelete(deletedTasks);

                break;
        }
    }

    function listenTask(listenTask: Task[]) {
        tasks = [...listenTask];
        viewTasks = [...tasks];

        if (isLoadingTask) {
            setTimeout(() => (isLoadingTask = false), 1);
        }
    }

    onMount(() => {
        unsubTask = taskRepository.store.subscribe(listenTask);
    });

    onDestroy(() => {
        unsubTask();
    });
</script>

<div class="todo-app">
    <div class="header shadow-sm">
        <h4 class="h4 text-center">Todo App</h4>

        <TodoPoster
            on:post={onPost}
            bind:todoValue={text}
            bind:disabled={disablePoster}
        />
    </div>

    <div class="tasks">
        <div class="list">
            {#if !isLoadingTask}
                {#if viewTasks && viewTasks.length > 0}
                    {#each viewTasks as task (task.id)}
                        <TodoItem {task} />
                    {/each}
                {:else}
                    <p class="text-muted text-center p-4">No tasks yet...</p>
                {/if}
            {:else}
                <p class="text-muted text-center p-4">Loading tasks...</p>
            {/if}
        </div>
        <div class="filter">
            <div class="row">
                <div
                    class="col-12 col-sm-2 d-flex align-items-center justify-content-center"
                >
                    {remainingTasks} / {tasks.length} left
                </div>
                <div
                    class="col-12 col-sm-5 d-flex align-items-center justify-content-center mt-2 mt-sm-0"
                >
                    <div class="btn-group">
                        <button
                            class="btn btn-primary btn-sm"
                            class:active={viewType == 0}
                            data-view="0"
                            on:click={changeView}>All</button
                        >
                        <button
                            class="btn btn-primary btn-sm "
                            class:active={viewType == 1}
                            data-view="1"
                            on:click={changeView}>Active</button
                        >
                        <button
                            class="btn btn-primary btn-sm  "
                            class:active={viewType == 2}
                            data-view="2"
                            on:click={changeView}>Completed</button
                        >
                    </div>
                </div>
                <div
                    class="col-12 col-sm-5 d-flex align-items-center justify-content-center  mt-2 mt-sm-0"
                >
                    <div class="btn-group">
                        <button
                            class="btn btn-success btn-sm"
                            on:click={performAction}
                            data-action="mac"
                        >
                            Mark All Complete
                        </button>
                        <button
                            class="btn btn-info btn-sm"
                            on:click={performAction}
                            data-action="mau"
                        >
                            Mark All Uncomplete
                        </button>
                        <button
                            class="btn btn-danger  btn-sm"
                            on:click={performAction}
                            data-action="dac"
                        >
                            Delete All Completed
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    .todo-app {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        .header {
            width: 768px;
            max-width: 90vw;
            padding: 1rem;
            background-color: #fafafa;
            border-bottom-left-radius: 1rem;
            border-bottom-right-radius: 1rem;
        }

        .tasks {
            flex: 1;
            display: flex;
            flex-direction: column;
            width: 768px;
            max-width: 90vw;
            padding-top: 1rem;
            overflow: auto;

            .list {
                display: flex;
                flex-direction: column;
                flex: 1;
                overflow: auto;
            }

            .filter {
                padding: 1rem;
                display: flex;
                align-items: center;
            }
        }
    }
</style>
