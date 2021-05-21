<script>
	import ItemColor from './TailwindItemColor.svelte'
	import ItemText from './TailwindItemText.svelte'
	import SectionGradient from './GenericGradientSection.svelte'
	import SectionSolid from './GenericSolidColorSection.svelte'

	import Prism from 'svelte-prism'
	import 'prism-theme-night-owl'

	let textData = []
	let colorData = []
	let codeData = ''
	let emptySelection = false

	$: textObservable = textData
	$: codeObservable = codeData
	$: emptyObservable = emptySelection

	if (false) {
		// DEBUG
		colorData = [
			{ name: 'orange-400', hex: '#f2994a' },
			{ name: 'red-500', hex: '#eb5757' },
			{ name: 'gray-700', hex: '#595959' },
			{ name: 'black', hex: '#000000' },
			{ name: 'white', hex: '#ffffff' },
			{ name: 'green-700', hex: '#219653' },
		]

		textData = [
			{ name: 'Header', attr: 'font-xs bold a' },
			{ name: 'Lorem ipsum dolores', attr: 'text-sm wide ahja ahja aaa' },
			{ name: 'Figma to Code', attr: 'aa asa dad asdad' },
			{
				name: 'Layout',
				attr: 'asd asda sdsd asda sdbhjas dhasjj asidasuidhausdh asudh asuhud ahs dasas',
			},
		]

		codeData = `<div class="inline-flex items-center justify-center p-1 space-x-1 border-2 border-gray-700 rounded-lg">
<div class="flex items-center justify-center h-4 p-1 bg-white rounded-lg"><p class="w-4 h-4 text-xs font-bold text-center text-gray-700">Aa</p></div>
<div class="inline-flex flex-col items-center self-start justify-center w-16 p-1"><p class="self-start text-xs font-medium text-black">Header</p><p class="self-start text-xs text-black">font-xs bold arhhh</p></div></div>
`
	}

	onmessage = (event) => {
		console.log('got this from the plugin code', event.data)
		if (!event.data.pluginMessage) {
			return
		}

		if (emptySelection !== (event.data.pluginMessage.type === 'empty')) {
			emptySelection = event.data.pluginMessage.type === 'empty'
		}

		if (event.data.pluginMessage.type === 'text') {
			textData = event.data.pluginMessage.data
		} else if (event.data.pluginMessage.type === 'result') {
			codeData = event.data.pluginMessage.data
		}
	}

	import { Switch, Button } from '../components/figma-plugin-ds-svelte'

	let jsx = false
	$: if (jsx || !jsx) {
		parent.postMessage({ pluginMessage: { type: 'jsx', data: jsx } }, '*')
	}

	let layerName = false
	$: if (layerName || !layerName) {
		parent.postMessage(
			{ pluginMessage: { type: 'layerName', data: layerName } },
			'*',
		)
	}

	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()
	const clipboard = (data) => dispatch('clipboard', { text: data })

	function handleClipboard(event) {
		clipboard(event.detail.text)
	}

	// INIT
	import { onMount } from 'svelte'
	onMount(() => {
		parent.postMessage({ pluginMessage: { type: 'tailwind' } }, '*')
	})

	const sectionStyle = 'border rounded-lg bg-white'
</script>

<div>
	<div class="flex flex-col items-center p-4 bg-gray-50">
		<div class="flex space-x-4 mt-2">
			<a href="https://play.tailwindcss.com/" target="_blank">
				<Button variant="secondary">Tailwind Play</Button>
			</a>
		</div>
	</div>
</div>

<div class="px-2 pt-2 bg-gray-50">
	{#if emptySelection}
		<div
			class="flex flex-col space-y-2 m-auto items-center justify-center p-4 {sectionStyle}"
		>
			<p class="text-lg font-bold">Nothing is selected</p>
			<p class="text-xs">Try selecting a layer, any layer</p>
		</div>
	{:else}
		<div class="w-full pt-2 {sectionStyle}">
			<div class="flex items-center justify-between px-2 space-x-2">
				<Button variant="primary" on:click={clipboard(codeObservable)}>
					Copy
				</Button>
			</div>

			<Prism language="html" source={codeObservable} />

			<div
				class="flex items-center content-center justify-end mx-2 mb-2 space-x-8"
			>
				<Switch bind:checked={layerName} id="layerName">LayerName</Switch>

				<Switch bind:checked={jsx} id="jsx">JSX</Switch>
			</div>
		</div>
		<div class="h-2" />

		{#if textObservable.length > 0}
			<div
				class="flex flex-col space-y-2 items-center w-full p-2 mb-2 {sectionStyle}"
			>
				<div class="flex flex-wrap w-full">
					<div class="w-1/2 p-1">
						<div
							class="flex items-center justify-center w-full h-full bg-gray-200
              rounded-lg"
						>
							<p class="text-xl font-semibold">Texts</p>
						</div>
					</div>
					{#each textObservable as item}
						<div class="w-1/2 p-1">
							<ItemText {...item} on:clipboard={clipboard(item.full)} />
						</div>
					{/each}
				</div>
			</div>
		{/if}
		<div class="h-2" />

		<SectionSolid
			{sectionStyle}
			type="tailwind"
			on:clipboard={handleClipboard}
		/>

		<div class="h-2" />

		<SectionGradient {sectionStyle} on:clipboard={handleClipboard} />
	{/if}
</div>
