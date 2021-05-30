import type {
	SBlendMixin,
	SFrameNode,
	SGeometryMixin,
	SLayoutMixin,
	SRectangleNode,
	SSceneNode,
	SSceneNodeMixin,
} from '../nodes/types'
import {
	rowColumnProps,
	tailwindContainer,
	tailwindWidgetGenerator,
} from './tailwindMain'
import { paramCase } from 'param-case'
import { createRemFromPx, toFixed } from '../helper'
import { numToAutoFixed } from '../common/numToAutoFixed'

const sScene = (node: SSceneNodeMixin): { clazz: string[] } => {
	const clazz = []
	if (node.visible !== undefined && !node.visible) {
		clazz.push('invisible')
	}
	return { clazz }
}

const sBlend = (node: SBlendMixin): { clazz: string[]; style: string[] } => {
	const clazz = []
	const style = []
	// [when testing] node.opacity can be undefined
	if (node.opacity !== undefined && node.opacity !== 1) {
		clazz.push(`opacity-[${node.opacity}]`)
	}

	if (node.blendMode !== 'PASS_THROUGH') {
		clazz.push(`mix-blend-${paramCase(node.blendMode)}`)
	}

	if (node.effects && node.effects.length > 0) {
		console.log(
			'🇻🇳 ~ file: tailwindConversion.ts ~ line 36 ~ node.effects',
			node.effects,
		)

		node.effects.forEach((effect) => {
			const getShadow = (effect): string => {
				const x = createRemFromPx(effect.offset.x)
				const y = createRemFromPx(effect.offset.y)
				const blur = createRemFromPx(effect.radius)
				const spread = createRemFromPx(effect.spread)

				const getColorValue = (value) => {
					return Math.round(value * 255)
				}

				const r = getColorValue(effect.color.r)
				const g = getColorValue(effect.color.g)
				const b = getColorValue(effect.color.b)
				const a = toFixed(effect.color.a, 2)

				return `${x}rem ${y}rem ${blur}rem ${spread}rem rgba(${r}, ${g}, ${b}, ${a})`
			}

			if (effect.visible) {
				switch (effect.type) {
					case 'DROP_SHADOW':
						style.push(`box-shadow: ${getShadow(effect)}`)
						break
					case 'INNER_SHADOW':
						style.push(`box-shadow: inset ${getShadow(effect)}`)
						break
					// TODO:
					case 'LAYER_BLUR':
						break
					case 'BACKGROUND_BLUR':
						break
					default:
						break
				}
			}
		})
	}

	return { clazz, style }

	// return [
	// 'isMask',
	// 'effectStyleId',
	// ]
}

const sLayout = (node: SLayoutMixin): { clazz: string[]; style: string[] } => {
	console.log('🇻🇳 ~ file: tailwindConversion.ts ~ line 92 ~ node', node)
	const clazz = []
	const style = []

	if (node.rotation !== undefined && Math.round(node.rotation) !== 0) {
		const rotation = -Math.round(node.rotation)

		clazz.push(`transform rotate-[${rotation}deg]`)
	}

	// TODO: check isRelative inside convertToAutoLayout

	if (node.width && node.height) {
		style.push(`w-[${numToAutoFixed(node.width)}px]`)
		style.push(`h-[${numToAutoFixed(node.height)}px]`)
	}

	return { clazz, style }
	// return [
	// 	'absoluteTransform',
	// 	'relativeTransform',
	// 	'x',
	// 	'y',
	// 	'constrainProportions',
	// 	'layoutAlign',
	// 	'layoutGrow',
	// ]
}

export function tailwindSRectangle(
	node: SRectangleNode,
	children: string,
	// additionalAttr: string,
	// attr: {
	// 	isRelative: boolean
	// 	isInput: boolean
	// },
): { clazz: string; style: string } {
	const clazz = [
		...sBlend(node).clazz,
		...sScene(node).clazz,
		...sLayout(node).clazz,
	].join(' ')
	const style = [...sBlend(node).style].join('; ')

	// 	const builder = new TailwindDefaultBuilder(node, showLayerName)
	// 	.blend(node)
	// 	.widthHeight(node)
	// 	.autoLayoutPadding(node)
	// 	.position(node, parentId, attr.isRelative)
	// 	.customColor(node.fills, 'bg')
	// 	// TODO image and gradient support (tailwind does not support gradients)
	// 	.shadow(node)
	// 	.border(node)

	// if (attr.isInput) {
	// 	// children before the > is not a typo.
	// 	return `\n<input${builder.build(additionalAttr)}${children}></input>`
	// }

	// if (builder.attributes || additionalAttr) {
	// 	const build = builder.build(additionalAttr)

	// 	// image fill and no children -- let's emit an <img />
	// 	let tag = 'div'
	// 	let src = ''
	// 	if (retrieveTopFill(node.fills)?.type === 'IMAGE') {
	// 		tag = 'img'
	// 		src = ` src="https://via.placeholder.com/${node.width}x${node.height}"`
	// 	}
	// 	let focusSection = ''
	// 	if (node.focusSection) {
	// 		scriptSet.add('focusSection')
	// 		focusSection = ` use:focusSection={${JSON.stringify(node.focusSection)}} `
	// 	}

	// 	if (children) {
	// 		return `\n<${tag}${focusSection}${build}${src} >${indentString(
	// 			children,
	// 		)}\n</${tag}>`
	// 	} else {
	// 		return `\n<${tag}${focusSection}${build}${src} />`
	// 	}
	// }

	return { clazz, style }
}
