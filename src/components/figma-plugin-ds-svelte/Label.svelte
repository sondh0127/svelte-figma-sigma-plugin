<script lang="ts">
	let clazz = ''
	export { clazz as class }

	export let active: boolean
</script>

<div
	class="{clazz} text-xs tracking-widest hover:text-black flex h-8 w-full items-center cursor-default select-none py-0 pl-1 pr-2 {active
		? 'text-black font-semibold'
		: 'text-black3 font-normal'}"
	on:click
>
	<slot />
</div>
