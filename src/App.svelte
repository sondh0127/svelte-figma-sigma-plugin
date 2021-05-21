<script lang="ts">
	import ScreenTailwind from './screens/ScreenTailwind.svelte'
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
		theme: {
			colors: {
				/* Accent */
				blue: '#18a0fb',
				purple: '#7b61ff',
				pink: '#ff00ff',
				green: '#1bc47d',
				red: '#f24822',
				yellow: '#ffeb00',

				/* Basic foreground */
				black: '#000',
				black8: 'rgba(0, 0, 0, 0.8)',
				'black8-opaque': '333333',
				black3: 'rgba(0, 0, 0, 0.3)',
				'black3-opaque': '#b3b3b3',
				white: '#ffffff',
				white8: 'rgba(255, 255, 255, 0.8)',
				white4: 'rgba(255, 255, 255, 0.4)',

				/* Basic background */
				grey: '#f0f0f0',
				silver: '#e5e5e5',
				hud: '#222222',
				toolbar: '#2c2c2c',

				/* Special */
				black1: 'rgba(0, 0, 0, 0.1)',
				blue3: 'rgba(24, 145, 251, 0.3)',
				purple4: 'rgba(123, 97, 255, 0.4)',
				'hover-fill': 'rgba(0, 0, 0, 0.06)',
				'selection-a': '#daebf7',
				'selection-b': '#edf5fa',
				white2: 'rgba(255, 255, 255, 0.2)',
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
			},
			fontSize: {
				xs: ['11px', '16px'],
				sm: ['12px', '16px'],
				base: ['13px', '24px'],
				lg: ['14px', '24px'],
			},
			letterSpacing: {
				tightest: '-.005em',
				tighter: '-.0025em',
				tight: '-.001em',
				normal: '0',
				wide: '.001em',
				wider: '.0025em',
				widest: '.005em',
				'widest-double': '.01em',
			},
			borderRadius: {
				none: '0',
				sm: '2px',
				md: '5px',
				lg: '6px',
			},
			boxShadow: {
				hud: '0 5px 17px rgba(0, 0, 0, 0.2), 0 2px 7px rgba(0, 0, 0, 0.15)',
				'floating-window': '0 2px 14px rgba(0, 0, 0, 0.15)',
				none: 'none',
			},
		},
	})
</script>

<main>
	<ScreenTailwind on:clipboard={updateClipboard} />
</main>

<style>
</style>
