<script lang="ts">
	import ScreenTailwind from './screens/ScreenTailwind.svelte'
	import { Button } from './components/figma-plugin-ds-svelte'
	import copy from 'clipboard-copy'
	function delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms))
	}
	let visible = false

	function updateClipboard(event) {
		copy(event.detail.text)
		visible = true
		delay(1000).then(() => {
			visible = false
		})
	}

	import { setup, disconnect } from 'twind/shim'
	setup({
		preflight: false,
	})
</script>

<main>
	<Button variant="secondary" class="mr-xsmall">Copied!</Button>
	<ScreenTailwind on:clipboard={updateClipboard} />
</main>

<style>
</style>
