import type { AltSceneNode } from '../../altNodes/altMixins'
import { pxToLayoutSize } from '../conversionTables'
import { nodeWidthHeight } from '../../common/nodeWidthHeight'
import { numToAutoFixed } from '../../common/numToAutoFixed'

export const tailwindSize = (node: AltSceneNode): string => {
	return tailwindSizePartial(node).join('')
}

export const tailwindSizePartial = (node: AltSceneNode): [string, string] => {
	const size = nodeWidthHeight(node, true)

	let w = ''
	if (typeof size.width === 'number') {
		w += `w-${pxToLayoutSize(size.width)} `
	} else if (typeof size.width === 'string') {
		if (
			size.width === 'full' &&
			node.parent &&
			'layoutMode' in node.parent &&
			node.parent.layoutMode === 'HORIZONTAL'
		) {
			w += `flex-1 `
		} else {
			w += `w-${size.width} `
		}
	}

	let h = ''

	if (typeof size.height === 'number') {
		h = `h-${pxToLayoutSize(size.height)} `
	} else if (typeof size.height === 'string') {
		if (
			size.height === 'full' &&
			node.parent &&
			'layoutMode' in node.parent &&
			node.parent.layoutMode === 'VERTICAL'
		) {
			h += `flex-1 `
		} else {
			h += `h-${size.height} `
		}
	}

	return [w, h]
}

/**
 * https://www.w3schools.com/css/css_dimension.asp
 */
export const htmlSizeForTailwind = (node: AltSceneNode): string => {
	return htmlSizePartialForTailwind(node).join('')
}

export const htmlSizePartialForTailwind = (
	node: AltSceneNode,
): [string, string] => {
	// todo refactor with formatWithJSX when more attribute to come
	return [
		`w-[${numToAutoFixed(node.width)}px] `,
		`h-[${numToAutoFixed(node.height)}px] `,
	]

	// return [
	//   formatWithJSX("width", node.width),
	//   formatWithJSX("height", node.height),
	// ];
}
