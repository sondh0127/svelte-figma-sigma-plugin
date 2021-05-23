import { retrieveTailwindText } from './tailwind/retrieveUI/retrieveTexts'
import {
	retrieveGenericLinearGradients,
	retrieveGenericSolidUIColors,
} from './common/retrieveUI/retrieveColors'
import { tailwindMain } from './tailwind/tailwindMain'
import { convertIntoAltNodes } from './altNodes/altConversion'
import { clone } from './helper'
import type { SInstanceNode } from './nodes/types'
import { once, emit, on } from './utilities/events'
import { createImagePaint } from './utilities/node/create-image-paint'
import { pick } from './utilities/object/extract-attributes'
import { getSceneNodeById } from './utilities/node/get-nodes/get-scene-node-by-id'

let parentId: string
let isJsx = false
let layerName = false
let material = true

let assets = {}

let mode: 'tailwind'

figma.showUI(__html__, { width: 450, height: 550 })

if (figma.command == 'addOnClick') {
	console.log('🇻🇳 ~ file: code.ts ~ line 23 ~ addOnClick')
}

const run = () => {
	// ignore when nothing was selected

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

	emit('result', result)

	if (mode === 'tailwind') {
		emit('colors', retrieveGenericSolidUIColors(convertedSelection, mode))
		emit('gradients', retrieveGenericLinearGradients(convertedSelection, mode))
	}
	if (mode === 'tailwind') {
		emit('text', retrieveTailwindText(convertedSelection))
	}
}

figma.on('selectionchange', () => {
	emit('selectionchange')
	const selection = figma.currentPage.selection
	const isSingleSelection = selection.length === 1

	if (isSingleSelection) {
		switch (selection[0].type) {
			case 'INSTANCE':
				const includeComponent = ['Button']
				const mainComponentName = selection[0].mainComponent.name

				if (includeComponent.includes(mainComponentName)) {
					const node = pick(selection[0], ['id', 'type'])
					let pluginData = []
					try {
						pluginData = JSON.parse(selection[0].getPluginData(selection[0].id))
					} catch (error) {
						pluginData = []
					}

					emit('pluginDataChange', node.id, pluginData)

					emit('selected', node)
				}
				break

			default:
				break
		}
	}

	run()
})

on('createInstance', (args) => {
	console.log('🇻🇳 ~ file: code.ts ~ line 207 ~ args', args)
	// const nodes: SceneNode[] = []
	const compName = 'Keypad'
	const comp = figma.createComponent()
	comp.name = compName

	const rect = figma.createRectangle()

	// create Image and get hash
	console.log(
		'🇻🇳 ~ file: code.ts ~ line 143 ~ assets[compName]',
		assets[compName],
	)

	const imgPaint = createImagePaint(assets[compName])
	console.log('🇻🇳 ~ file: code.ts ~ line 133 ~ imgPaint', imgPaint)

	rect.fills = [imgPaint]

	comp.appendChild(rect)
	console.log('🇻🇳 ~ file: code.ts ~ line 96 ~ comp', comp)
	// for (let i = 0; i < msg.count; i++) {
	// 	var shape

	// 	if (msg.shape === 'rectangle') {
	// 		shape = figma.createRectangle()
	// 	} else if (msg.shape === 'triangle') {
	// 		shape = figma.createPolygon()
	// 	} else if (msg.shape === 'line') {
	// 		shape = figma.createLine()
	// 	} else {
	// 		shape = figma.createEllipse()
	// 	}

	// 	shape.x = i * 150
	// 	shape.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }]
	// 	figma.currentPage.appendChild(shape)
	// 	nodes.push(shape)
	// }

	// figma.currentPage.selection = nodes
	// figma.viewport.scrollAndZoomIntoView(nodes)
})

on('pluginDataChange', (id, value) => {
	const screenNode = getSceneNodeById(id)
	screenNode.setPluginData(id, JSON.stringify(value))
})

on('createInteraction', (sSceneNode) => {
	const sInstanceNode: SInstanceNode = sSceneNode

	const interactions: SInstanceNode['interactions'] = [
		{
			trigger: { type: 'ON_CLICK' },
			action: { type: 'SELECT', option: 'A' },
		},
	]

	const node = figma.getNodeById(sInstanceNode.id)

	const pluginData = { interactions }

	node.setPluginData(node.id, JSON.stringify(pluginData))
	emit('pluginDataChange', node.id, pluginData)

	console.log('🇻🇳 ~ file: code.ts ~ line 204 ~ node', node)

	node.setRelaunchData({
		// open: 'Open this trapezoid with Shaper',
		addOnClick: 'Add sigma interactions',
	})
})

on('tailwind', (args) => {
	mode = 'tailwind'
	if (args.assets) {
		console.log('🇻🇳 ~ file: code.ts ~ line 199 ~ args', args)
		assets = args.assets
		// createInstance()
		// create
		/* <Component>
				<RectangleNode fill="Image">
				</RectangleNode>
			</Component> */
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
