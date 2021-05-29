<script lang="ts">
	import { Button, Label, Input } from '../components/figma-plugin-ds-svelte'
	import type { SInstanceNode } from '../nodes/types'
	import { sceneNode } from '../screens/ScreenTailwind.svelte'
	import { emit } from '../utilities/events'

	$: interactions = ($sceneNode?.interactions ||
		[]) as SInstanceNode['interactions']

	$: if ($sceneNode) {
		emit('sceneNodeChangeBack', {
			id: $sceneNode.id,
			key: 'interactions',
			value: interactions,
		})
	}

	function addInteractions() {
		$sceneNode.interactions = [
			...($sceneNode.interactions || []),
			{
				trigger: { type: 'ON_CLICK' },
				action: { type: 'SELECT', option: 'A' },
			},
		]
	}
	function removeInteractions(index) {
		$sceneNode.interactions = $sceneNode.interactions.filter(
			(_, i) => i != index,
		)
	}
</script>

<div class="flex flex-col">
	<div class="flex">
		<Label>Interactions</Label>
		<Button on:click={addInteractions}>+</Button>
	</div>
	{#each interactions as interaction, index (index)}
		<div class="flex justify-between">
			<span>{interaction.trigger.type}</span>
			<span>{interaction.action.type}</span>
			{#if interaction.action.type === 'SELECT'}
				<Input bind:value={interaction.action.option} />
			{/if}
			<Button on:click={() => removeInteractions(index)}>Remove</Button>
		</div>
	{/each}
</div>

<style>
	/* your styles go here */
</style>
