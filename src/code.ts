import { retrieveTailwindText } from './tailwind/retrieveUI/retrieveTexts'
import {
	retrieveGenericLinearGradients,
	retrieveGenericSolidUIColors,
} from './common/retrieveUI/retrieveColors'
import { tailwindMain } from './tailwind/tailwindMain'
import { convertIntoAltNodes } from './altNodes/altConversion'
import { clone } from './helper'
import type { SInstanceNode } from './nodes/types'

let parentId: string
let isJsx = false
let layerName = false
let material = true

let assets = {}

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
		const selection = figma.currentPage.selection
		parentId = selection[0].parent?.id ?? ''

		const isSingleSelection = selection.length === 1

		if (isSingleSelection) {
			switch (selection[0].type) {
				case 'INSTANCE':
					const includeComponent = ['Button']
					const mainComponentName = selection[0].mainComponent.name

					if (includeComponent.includes(mainComponentName)) {
						// search google this
						const { id, type, reactions } = selection[0]

						const node: SInstanceNode = { id, type, reactions }
						figma.ui.postMessage({
							type: 'selected',
							node,
						})
					}
					break

				default:
					break
			}
		}
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

async function createInstance() {
	const compName = 'Keypad'
	const comp = figma.createComponent()
	comp.name = compName

	const rect = figma.createRectangle()

	// create Image and get hash
	const imageHash = figma.createImage(assets[compName]).hash

	const imagePaint: ImagePaint = {
		type: 'IMAGE',
		scaleMode: 'FILL',
		imageHash: imageHash,
	}
	rect.fills = [imagePaint]

	comp.appendChild(rect)
	console.log('🇻🇳 ~ file: code.ts ~ line 96 ~ comp', comp)
}

figma.on('selectionchange', () => {
	figma.ui.postMessage({
		type: 'selectionchange',
	})
	run()
})

// efficient? No. Works? Yes.
// todo pass data instead of relying in types
figma.ui.onmessage = (msg) => {
	if (msg.type === 'tailwind') {
		mode = msg.type
		if (msg.assets) {
			assets = msg.assets
			// createInstance()
			// create
			/* <Component>
				<RectangleNode fill="Image">
				</RectangleNode>
			</Component> */
		}
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

	switch (msg.type) {
		case 'createInstance':
			console.log('🇻🇳 ~ file: code.ts ~ line 96 ~ msg', msg)
			console.log('🇻🇳 ~ file: code.ts ~ line 96 ~ figma', figma)
			const nodes: SceneNode[] = []
			console.log('🇻🇳 ~ file: code.ts ~ line 138 ~ assets', assets)
			createInstance(msg.component)
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
			break

		default:
			break
	}
}
