import type { SFrameNode } from '../../nodes/types'

const layoutModes: Record<SFrameNode['layoutMode'], string> = {
	NONE: 'block',
	HORIZONTAL: 'flex flex-row',
	VERTICAL: 'flex flex-col',
}

const itemSpacings: Record<SFrameNode['layoutMode'], string> = {
	NONE: '',
	HORIZONTAL: 'space-x-',
	VERTICAL: 'space-y-',
}

const primaryAxisAlignItems: Record<
	SFrameNode['primaryAxisAlignItems'],
	string
> = {
	MIN: 'justify-start',
	CENTER: 'justify-center',
	MAX: 'justify-end',
	SPACE_BETWEEN: 'justify-between',
}
const counterAxisAlignItems: Record<
	SFrameNode['counterAxisAlignItems'],
	string
> = {
	MIN: 'items-start',
	CENTER: 'items-center',
	MAX: 'items-end',
}

export const autoLayoutBuilder = (node: SFrameNode): string => {
	let classes = [
		layoutModes[node.layoutMode],
		node.primaryAxisAlignItems === 'SPACE_BETWEEN'
			? ''
			: `${itemSpacings[node.layoutMode]}[${node.itemSpacing}px]`,
		`${primaryAxisAlignItems[node.primaryAxisAlignItems]}`,
		`${counterAxisAlignItems[node.counterAxisAlignItems]}`,
	]

	return classes.filter((cls) => cls).join(' ')
}
