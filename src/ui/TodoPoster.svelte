<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let todoValue: string = null;
    export let disabled: boolean = false;

    const dispatch = createEventDispatcher();

    function newPost(e) {
        dispatch("post", { text: todoValue });
        return false;
    }
</script>

<div class="poster">
    <form class="todo-form" on:submit|preventDefault={newPost}>
        <input
            type="text"
            class="form-control m-0"
            placeholder="What's on your mind?"
            bind:value={todoValue}
            {disabled}
        />
        <button class="btn btn-primary todo-add ms-2" type="submit" {disabled}
            >Add</button
        >
    </form>
</div>

<style lang="scss">
    .poster {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;

        .todo-form {
            display: flex;
            align-items: center;

            .todo-add {
                width: fit-content;
            }
        }
    }
</style>
