<script lang="ts">
	import { Styles } from "sveltestrap";
	import TodoApp from "./ui/TodoApp.svelte";
</script>

<svelte:head>
	<title>Todo App</title>
</svelte:head>
<Styles />

<TodoApp />

<style lang="scss" global>
	body {
		margin: 0;
		padding: 0;
	}
</style>
