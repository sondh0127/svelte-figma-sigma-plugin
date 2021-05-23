<script>
	import { createEventDispatcher } from 'svelte'
	import { onDestroy } from 'svelte'
	import { on } from '../utilities/events'
	import TailwindItemColor from './TailwindItemColor.svelte'

	const dispatch = createEventDispatcher()
	const clipboard = (data) => dispatch('clipboard', { text: data })

	export let sectionStyle
	export let type

	let colorsData = []
	$: colorsObservable = colorsData

	const remove = on('colors', (colors) => {
		colorsData = colors
	})

	onDestroy(() => {
		remove()
	})
</script>

{#if colorsObservable.length > 0}
	<div
		class="flex flex-col space-y-2 items-center w-full p-2 mb-2 {sectionStyle}"
	>
		<div class="flex flex-wrap w-full">
			<div class="{type === 'flutter' ? 'w-1/2' : 'w-1/3'} p-1">
				<div
					class="flex items-center justify-center w-full h-full bg-gray-200
          rounded-lg"
				>
					<p class="text-xl font-semibold">Colors</p>
				</div>
			</div>

			{#each colorsObservable as item}
				<div class="w-1/3 p-1">
					<TailwindItemColor
						{...item}
						on:clipboard={clipboard(item.exported)}
					/>
				</div>
			{/each}
		</div>
	</div>
{/if}
