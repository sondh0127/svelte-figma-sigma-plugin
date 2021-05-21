import { retrieveTailwindText } from './tailwind/retrieveUI/retrieveTexts'
import {
	retrieveGenericLinearGradients,
	retrieveGenericSolidUIColors,
} from './common/retrieveUI/retrieveColors'
import { tailwindMain } from './tailwind/tailwindMain'
import { convertIntoAltNodes } from './altNodes/altConversion'

let parentId: string
let isJsx = false
let layerName = false
let material = true

let mode: 'tailwind'

figma.showUI(__html__, { width: 450, height: 550 })

const run = () => {
	// ignore when nothing was selected
	if (figma.currentPage.selection.length === 0) {
		figma.ui.postMessage({
			type: 'empty',
		})
		return
	}

	// check [ignoreStackParent] description
	if (figma.currentPage.selection.length > 0) {
		parentId = figma.currentPage.selection[0].parent?.id ?? ''
	}

	let result = ''
	console.log(
		'🇻🇳 ~ file: code.ts ~ line 38 ~ figma.currentPage.selection',
		figma.currentPage.selection[0],
	)
	const convertedSelection = convertIntoAltNodes(
		figma.currentPage.selection,
		null,
	)
	console.log(
		'🇻🇳 ~ file: code.ts ~ line 41 ~ convertedSelection',
		convertedSelection,
	)

	if (mode === 'tailwind') {
		result = tailwindMain(convertedSelection, parentId, isJsx, layerName)
	}

	figma.ui.postMessage({
		type: 'result',
		data: result,
	})

	if (mode === 'tailwind') {
		figma.ui.postMessage({
			type: 'colors',
			data: retrieveGenericSolidUIColors(convertedSelection, mode),
		})

		figma.ui.postMessage({
			type: 'gradients',
			data: retrieveGenericLinearGradients(convertedSelection, mode),
		})
	}
	if (mode === 'tailwind') {
		figma.ui.postMessage({
			type: 'text',
			data: retrieveTailwindText(convertedSelection),
		})
	}
}

figma.on('selectionchange', () => {
	run()
})

// efficient? No. Works? Yes.
// todo pass data instead of relying in types
figma.ui.onmessage = (msg) => {
	if (msg.type === 'tailwind') {
		mode = msg.type
		run()
	} else if (msg.type === 'jsx' && msg.data !== isJsx) {
		isJsx = msg.data
		run()
	} else if (msg.type === 'layerName' && msg.data !== layerName) {
		layerName = msg.data
		run()
	} else if (msg.type === 'material' && msg.data !== material) {
		material = msg.data
		run()
	}
}
