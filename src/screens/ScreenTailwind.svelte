<script context="module">
	import { writable } from 'svelte/store'

	export const sceneNode = writable(null)
</script>

<script lang="ts">
	import ItemColor from './TailwindItemColor.svelte'
	import ItemText from './TailwindItemText.svelte'
	import SectionGradient from './GenericGradientSection.svelte'
	import SectionSolid from './GenericSolidColorSection.svelte'
	import type { SFrameNode, SInstanceNode, SSceneNode } from '../nodes/types'
	import { onMount } from 'svelte'
	import TabControl from '../components/TabControl.svelte'
	import TabControlItem from '../components/TabControlItem.svelte'
	import { encode } from '../helper'
	import { emit, on } from '../utilities/events'
	import Prism from 'svelte-prism'
	import 'prism-theme-night-owl'
	import {
		Switch,
		Button,
		Label,
		Input,
	} from '../components/figma-plugin-ds-svelte'
	import { createEventDispatcher } from 'svelte'
	import NodeInteractions from '../lib/NodeInteractions.svelte'
	$: console.log(
		'🇻🇳 ~ file: ScreenTailwind.svelte ~ line 38 ~ $sceneNode',
		$sceneNode,
	)

	let textData = []
	let colorData = []
	let codeData = ''
	let emptySelection = false

	$: textObservable = textData
	$: codeObservable = codeData

	$: focusSection = ($sceneNode?.focusSection ||
		null) as SFrameNode['focusSection']

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

	on('selectionchange', () => {
		sceneNode.set(null)
	})

	on('sceneNodeChange', (_sceneNode) => {
		sceneNode.set(_sceneNode)
	})

	on('empty', (args) => {
		emptySelection = true
	})

	on('text', (args) => {
		textData = args
	})

	on('result', (result) => {
		emptySelection = false
		codeData = result
	})

	let layerName = false
	$: if (layerName || !layerName) {
		emit('layerName', { data: layerName })
	}

	const dispatch = createEventDispatcher()
	const clipboard = (data) => dispatch('clipboard', { text: data })

	function handleClipboard(event) {
		clipboard(event.detail.text)
	}

	onMount(async () => {
		/* 		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')
		canvas.width = (imageKeypad as HTMLImageElement).width
		canvas.height = (imageKeypad as HTMLImageElement).height

		ctx.drawImage(imageKeypad, 0, 0)

		const newBytes = await new Promise((resolve, reject) => {
			canvas.toBlob((blob) => {
				const reader = new FileReader()
				reader.onload = () => resolve(new Uint8Array(reader.result))
				reader.onerror = () => reject(new Error('Could not read from blob'))
				reader.readAsArrayBuffer(blob)
			})
		})

		let assets = {}
		assets = { Keypad: newBytes }

		emit('tailwind', { assets }) */
		emit('tailwind')
	})

	function createKeypad() {
		emit('createInstance', {})
	}

	function resetPluginData() {
		// remove some interaction or remove other
	}

	function addFocusSection() {
		// const focusSection = {
		// 	id: sSceneNode.id,
		// }

		const focusSection: SFrameNode['focusSection'] = {
			default: true,
		}

		// const hasDefault = Object.values($pluginData).some(
		// 	(item) => item.focusSection,
		// )
		// if (!hasDefault) {
		// 	focusSection.default = true
		// }
		// $pluginData[sSceneNode.id] = { focusSection }
	}
	function removeFocusSection() {}
	function refresh() {
		emit('refresh')
	}

	const sectionStyle = 'border rounded-lg bg-white'
</script>

<TabControl>
	<div class="flex items-center" slot="tabs" let:tabs>
		{#each tabs as { active, disabled, payload, select }, i}
			<Label {active} on:click={select} {disabled}>
				{payload}
			</Label>
		{/each}
	</div>
	<div class="tab">
		<TabControlItem id="1" payload="Code" active>
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
							<Button variant="primary" on:click={refresh}>Refresh</Button>
						</div>

						<Prism language="svelte" source={codeObservable} />

						<div
							class="flex items-center content-center justify-end mx-2 mb-2 space-x-8"
						>
							<Switch bind:checked={layerName} id="layerName">LayerName</Switch>
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
		</TabControlItem>
		<TabControlItem id="2" payload="Component">
			<Button on:click={createKeypad}>Create Keypad</Button>
			<Button on:click={resetPluginData}>Reset</Button>
			{#if $sceneNode?.type === 'INSTANCE'}
				<NodeInteractions />
			{/if}

			{#if $sceneNode?.type === 'FRAME'}
				<div class="flex flex-col">
					<div class="flex">
						<Label>FRAME</Label>
						<Button on:click={addFocusSection}>+</Button>
					</div>

					{#if focusSection}
						<div class="flex items-center justify-between">
							<Label>
								<span>default:</span>
								<span>
									{focusSection.default === true}
								</span>
							</Label>
							<Button on:click={removeFocusSection}>Remove</Button>
						</div>
					{/if}
				</div>
			{/if}
		</TabControlItem>
	</div>
</TabControl>
