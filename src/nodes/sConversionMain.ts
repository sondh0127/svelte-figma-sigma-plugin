import { convertNodesOnRectangle } from './convertNodesOnRectangle'
import { convertToAutoLayout } from './convertToAutoLayout'
import type {
	SInstanceNode,
	SChildrenMixin,
	SBaseNode,
	SComponentNode,
	SSceneNode,
	SFrameNode,
	SRectangleNode,
	SGroupNode,
} from '../nodes/types'
import {
	convertIntoSComponent,
	convertIntoSEllipse,
	convertIntoSFrame,
	convertIntoSGroup,
	convertIntoSInstance,
	convertIntoSLine,
	convertIntoSRectangle,
	convertIntoSTextNode,
	convertIntoSVectorNode,
} from '../nodes/sConversion'
import { notEmpty } from '../helper'

type SParent = SFrameNode | SGroupNode | (SBaseNode & SChildrenMixin) | null

export const convertIntoSingleSNode = (
	node: SceneNode,
	parent: SParent = null,
): SSceneNode => {
	return convertIntoSNodes([node], parent)[0]
}

export const convertIntoSNodes = (
	sSceneNode: ReadonlyArray<SceneNode>,
	sParent: SFrameNode | SGroupNode | (SBaseNode & SChildrenMixin) | null = null,
): Array<SSceneNode> => {
	const mapped: Array<SSceneNode | null> = sSceneNode.map((node) => {
		switch (node.type) {
			case 'RECTANGLE': {
				const sNode = convertIntoSRectangle(node)
				if (sParent) {
					sNode.parent = sParent
				}
				return sNode
			}
			case 'ELLIPSE': {
				const sNode = convertIntoSEllipse(node)

				if (sParent) {
					sNode.parent = sParent
				}

				return sNode
			}
			case 'LINE': {
				const sNode = convertIntoSLine(node)

				if (sParent) {
					sNode.parent = sParent
				}

				// Lines have a height of zero, but they must have a height, so add 1.
				sNode.height = 1

				// Let them be CENTER, since on Lines this property is ignored.
				sNode.strokeAlign = 'CENTER'

				// Remove 1 since it now has a height of 1. It won't be visually perfect, but will be almost.
				sNode.strokeWeight = sNode.strokeWeight - 1

				return sNode
			}
			case 'VECTOR': {
				const sNode = convertIntoSVectorNode(node)

				if (sParent) {
					sNode.parent = sParent
				}

				// Vector support is still missing. Meanwhile, add placeholder.
				sNode.cornerRadius = 8

				// @ts-ignore
				if (sNode.fills === figma.mixed || sNode.fills.length === 0) {
					// Use rose[400] from Tailwind 2 when Vector has no color.
					sNode.fills = [
						{
							type: 'SOLID',
							color: {
								r: 0.5,
								g: 0.23,
								b: 0.27,
							},
							visible: true,
							opacity: 0.5,
							blendMode: 'NORMAL',
						},
					]
				}

				return sNode
			}
			case 'TEXT': {
				const sNode = convertIntoSTextNode(node)

				if (sParent) {
					sNode.parent = sParent
				}

				return sNode
			}
			case 'COMPONENT': {
				const sNode = convertIntoSComponent(node)
				if (sParent) {
					sNode.parent = sParent
				}

				if (sParent) {
					sNode.parent = sParent
				}

				sNode.children = convertIntoSNodes(node.children, sNode)

				return sNode
			}
			case 'GROUP': {
				if (node.children.length === 1 && node.visible !== false) {
					// if Group is visible and has only one child, Group should disappear.
					// there will be a single value anyway.
					return convertIntoSNodes(node.children, sParent)[0]
				}

				// const iconToRect = iconToRectangle(node, sParent)
				// if (iconToRect != null) {
				// 	return iconToRect
				// }

				const sNode = convertIntoSGroup(node)

				if (sParent) {
					sNode.parent = sParent
				}

				sNode.children = convertIntoSNodes(node.children, sNode)

				// try to find big rect and regardless of that result, also try to convert to autolayout.
				// There is a big chance this will be returned as a Frame
				// also, Group will always have at least 2 children.
				return convertNodesOnRectangle(sNode)
			}

			case 'INSTANCE': {
				const sNode = convertIntoSInstance(node)
				if (sParent) {
					sNode.parent = sParent
				}
				if (node.children) {
					sNode.children = convertIntoSNodes(node.children, sNode)
				}

				return convertToAutoLayout(sNode)
			}
			case 'FRAME': {
				// const iconToRect = iconToRectangle(node, sParent)
				// if (iconToRect != null) {
				// 	return iconToRect
				// }

				/* TODO: Consider if it's needed */
				// if (node.children.length === 0) {
				// 	const newNode = new AltRectangleNode()

				// 	newNode.id = node.id
				// 	newNode.name = node.name

				// 	if (altParent) {
				// 		newNode.parent = altParent
				// 	}

				// 	convertDefaultShape(newNode, node)
				// 	convertRectangleCorner(newNode, node)
				// 	convertCorner(newNode, node)
				// 	return newNode
				// }

				const sNode = convertIntoSFrame(node)

				if (sParent) {
					sNode.parent = sParent
				}

				sNode.children = convertIntoSNodes(node.children, sNode)

				// return convertToAutoLayout(convertNodesOnRectangle(sNode))
				return sNode
			}
			default:
				return null
		}
	})

	return mapped.filter(notEmpty)
}

// const iconToRectangle = (
// 	node: FrameNode | InstanceNode | ComponentNode | GroupNode,
// 	altParent: SFrameNode | SGroupNode | (SBaseNode & SChildrenMixin) | null,
// ): SRectangleNode | null => {
// 	if (node.children.every((d) => d.type === 'VECTOR')) {
// 		const sNode = convertIntoSRectangle(node)

// 		if (altParent) {
// 			sNode.parent = altParent
// 		}

// 		sNode.cornerRadius = 8

// 		sNode.strokes = []
// 		sNode.strokeWeight = 0
// 		sNode.strokeMiterLimit = 0
// 		sNode.strokeAlign = 'CENTER'
// 		sNode.strokeCap = 'NONE'
// 		sNode.strokeJoin = 'BEVEL'
// 		sNode.dashPattern = []
// 		sNode.fillStyleId = ''
// 		sNode.strokeStyleId = ''

// 		sNode.fills = [
// 			{
// 				type: 'IMAGE',
// 				imageHash: '',
// 				scaleMode: 'FIT',
// 				visible: true,
// 				opacity: 0.5,
// 				blendMode: 'NORMAL',
// 			},
// 		]

// 		return sNode
// 	}
// 	return null
// }
