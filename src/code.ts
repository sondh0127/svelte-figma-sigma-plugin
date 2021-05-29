import { retrieveTailwindText } from './tailwind/retrieveUI/retrieveTexts'
import {
	retrieveGenericLinearGradients,
	retrieveGenericSolidUIColors,
} from './common/retrieveUI/retrieveColors'
import { tailwindMain } from './tailwind/tailwindMain'
import {
	convertIntoSNodes,
	convertSingleNodeToAlt,
} from './altNodes/altConversion'
import { clone } from './helper'
import type { SFrameNode, SInstanceNode, SSceneNode } from './nodes/types'
import { once, emit, on } from './utilities/events'
import { createImagePaint } from './utilities/node/create-image-paint'
import { pick } from './utilities/object/extract-attributes'
import { getSceneNodeById } from './utilities/node/get-nodes/get-scene-node-by-id'

let parentId: string
let isJsx = false
let layerName = false

let assets = {}

let mode: 'tailwind'

figma.showUI(__html__, { width: 450, height: 550 })

if (figma.command == 'addOnClick') {
}

const run = () => {
	if (figma.currentPage.selection.length === 0) {
		emit('empty')
		return
	}

	// check [ignoreStackParent] description
	if (figma.currentPage.selection.length > 0) {
		const selection = figma.currentPage.selection
		parentId = selection[0].parent?.id ?? ''
	}

	let result = ''
	debugger
	const convertedSelection = convertIntoSNodes(
		figma.currentPage.selection,
		null,
	)

	if (mode === 'tailwind') {
		result = tailwindMain(convertedSelection, parentId, isJsx, layerName)
	}

	emit('result', result)

	// if (mode === 'tailwind') {
	// 	emit('colors', retrieveGenericSolidUIColors(convertedSelection, mode))
	// 	emit('gradients', retrieveGenericLinearGradients(convertedSelection, mode))
	// }
	// if (mode === 'tailwind') {
	// 	emit('text', retrieveTailwindText(convertedSelection))
	// }
}

function handleNodeSelection() {
	emit('selectionchange')
	const selection = figma.currentPage.selection
	const isSingleSelection = selection.length === 1

	if (isSingleSelection) {
		//  Can use convertIntoSNodes to achieved better node structure
		let node: SSceneNode = convertSingleNodeToAlt(selection[0], null)
		node.children = []

		if (node) {
			emit('sceneNodeChange', node)
		}
	}

	run()
}

figma.on('selectionchange', () => {
	handleNodeSelection()
})

on('mount', () => {
	handleNodeSelection()
})

on('sceneNodeChangeBack', (payload) => {
	const { id, key, value } = payload
	console.log('🇻🇳 ~ file: code.ts ~ line 122 ~ payload', payload)

	function setPluginData({ id, key, value }) {
		const screenNode = getSceneNodeById(id)
		screenNode.setPluginData(key, JSON.stringify(value))
	}

	switch (key) {
		case 'interactions':
			setPluginData({ id, key, value })
			break

		default:
			break
	}
})

on('createInstance', (args) => {
	const compName = 'Keypad'
	const comp = figma.createComponent()
	comp.name = compName

	const rect = figma.createRectangle()

	const imgPaint = createImagePaint(assets[compName])

	rect.fills = [imgPaint]

	comp.appendChild(rect)

	// figma.currentPage.selection = nodes
	// figma.viewport.scrollAndZoomIntoView(nodes)
})

on('tailwind', (args) => {
	mode = 'tailwind'
	if (args?.assets) {
		assets = args.assets
	}
	run()
})

on('jsx', (args) => {
	if (args.data !== isJsx) {
		isJsx = args.data
		run()
	}
})

on('layerName', (args) => {
	if (args.data !== layerName) {
		layerName = args.data
		run()
	}
})
