import { getBoundingRect } from '../altNodes/altConversion'
import { computeBoundingBox } from '../utilities/node/compute-bounding-box'
import { pick } from '../utilities/object/extract-attributes'
import type {
	SComponentNode,
	SInstanceNode,
	SBlendMixin,
	SSceneNodeMixin,
	SLayoutMixin,
	SGeometryMixin,
	SBaseFrameMixin,
	SContainerMixin,
	SCornerMixin,
	SRectangleCornerMixin,
	SConstraintMixin,
	SBaseNodeMixin,
} from './types'
import { convertToAutoLayout } from '../altNodes/convertToAutoLayout'
import { cloneObject } from '../utilities/object/clone-object'

const convertSLayout = (node: LayoutMixin): SLayoutMixin => {
	// Get the correct X/Y position when rotation is applied.
	// This won't guarantee a perfect position, since we would still
	// need to calculate the offset based on node width/height to compensate,
	// which we are not currently doing. However, this is a lot better than nothing and will help LineNode.
	const sLayoutNode = {
		...pick(node, [
			'absoluteTransform',
			'relativeTransform',
			'x',
			'y',
			'rotation',

			'width',
			'height',
			'constrainProportions',

			'layoutAlign',
			'layoutGrow',
		]),
	}
	if (node.rotation !== undefined && Math.round(node.rotation) !== 0) {
		const boundingRect = getBoundingRect(node)
		console.log(
			'🇻🇳 ~ file: sConversion.ts ~ line 35 ~ boundingRect',
			boundingRect,
		)

		// TODO: place getBoundingRect with  computeBoundingBox
		const boundingRect2 = computeBoundingBox(node as any)
		console.log(
			'🇻🇳 ~ file: sConversion.ts ~ line 35 ~ boundingRect2',
			boundingRect2,
		)
		sLayoutNode.x = boundingRect.x
		sLayoutNode.y = boundingRect.y
	}

	return sLayoutNode
}

const convertSGeometry = (node: GeometryMixin): SGeometryMixin => {
	const fills = cloneObject(node.fills) as SGeometryMixin['fills']
	const strokes = cloneObject(node.strokes) as SGeometryMixin['strokes']
	const strokeCap = cloneObject(node.strokeCap) as SGeometryMixin['strokeCap']
	const strokeJoin = cloneObject(
		node.strokeJoin,
	) as SGeometryMixin['strokeJoin']
	const dashPattern = cloneObject(
		node.dashPattern,
	) as SGeometryMixin['dashPattern']

	const fillStyleId = cloneObject(
		node.fillStyleId,
	) as SGeometryMixin['fillStyleId']
	return {
		...pick(node, [
			'strokeWeight',
			'strokeMiterLimit',
			'strokeAlign',
			'strokeStyleId',
		]),
		fills,
		strokes,
		strokeCap,
		strokeJoin,
		dashPattern,
		fillStyleId,
	}
}

const convertSBlend = (node: BlendMixin): SBlendMixin => {
	return {
		...pick(node, [
			'opacity',
			'blendMode',
			'isMask',
			'effects',
			'effectStyleId',
		]),
	}
}

const convertSContainer = (node: ContainerMixin): SContainerMixin => {
	return {
		...pick(node, ['expanded']),
	}
}

const convertSCorner = (node: CornerMixin): SCornerMixin => {
	const cornerRadius = cloneObject(
		node.cornerRadius,
	) as SCornerMixin['cornerRadius']
	const cornerSmoothing = cloneObject(
		node.cornerSmoothing,
	) as SCornerMixin['cornerSmoothing']

	return {
		cornerRadius,
		cornerSmoothing,
	}
}

const convertSRectangleCorner = (
	node: RectangleCornerMixin,
): SRectangleCornerMixin => {
	return {
		...pick(node, [
			'topLeftRadius',
			'topRightRadius',
			'bottomLeftRadius',
			'bottomRightRadius',
		]),
	}
}

const convertSConstraint = (node: ConstraintMixin): SConstraintMixin => {
	return {
		...pick(node, ['constraints']),
	}
}

const convertSBaseNode = (node: BaseNodeMixin): SBaseNodeMixin => {
	return {
		...pick(node, ['id', 'name']),
		parent: null,
	}
}

const convertSBaseFrame = (node: BaseFrameMixin): SBaseFrameMixin => {
	const layoutGrids = cloneObject(
		node.layoutGrids,
	) as SBaseFrameMixin['layoutGrids']
	const guides = cloneObject(node.guides) as SBaseFrameMixin['guides']

	const baseFrameNode: SBaseFrameMixin = {
		...convertSScene(node),
		...convertSBaseNode(node),
		children: [],
		...convertSContainer(node),
		...convertSGeometry(node),
		...convertSRectangleCorner(node),
		...convertSCorner(node),
		...convertSBlend(node),
		...convertSConstraint(node),
		...convertSLayout(node),
		...pick(node, [
			'layoutMode',
			'primaryAxisSizingMode',
			'counterAxisSizingMode',
			'primaryAxisAlignItems',
			'counterAxisAlignItems',
			'paddingLeft',
			'paddingRight',
			'paddingTop',
			'paddingBottom',
			'itemSpacing',
			'gridStyleId',
			'clipsContent',
		]),
		layoutGrids,
		guides,
	}

	// Fix this: https://stackoverflow.com/questions/57859754/flexbox-space-between-but-center-if-one-element
	// It affects HTML, Tailwind, Flutter and possibly SwiftUI. So, let's be consistent.
	if (
		node.primaryAxisAlignItems === 'SPACE_BETWEEN' &&
		node.children.length === 1
	) {
		baseFrameNode.primaryAxisAlignItems = 'CENTER'
	}

	return baseFrameNode
}

const convertSScene = (node: SceneNodeMixin): SSceneNodeMixin => {
	return {
		...pick(node, ['locked', 'visible']),
	}
}
// Nodes Conversion

export const convertIntoSComponent = (node: ComponentNode): SComponentNode => {
	const interactions: SInstanceNode['interactions'] = []
	return {
		...convertSBaseFrame(node),
		...pick(node, ['type', 'remote', 'key']),
		interactions,
	}
}

type ComponentTag = 'Keypad' | 'Button'

export const convertIntoSInstance = (node: InstanceNode): SInstanceNode => {
	let interactions = []
	try {
		JSON.parse(node.getPluginData(node.id))['interactions']
	} catch (error) {
		interactions = []
	}

	return convertToAutoLayout({
		...convertSBaseFrame(node),
		...pick(node, ['type']),
		interactions,
		mainComponent: convertIntoSComponent(node.mainComponent),
	})
}

export const convertIntoSFrame = (node: InstanceNode): SInstanceNode => {
	let focusSection = null
	try {
		focusSection = JSON.parse(node.getPluginData(node.id))['focusSection']
	} catch (error) {
		focusSection = null
	}
	return convertToAutoLayout({
		...convertSBaseFrame(node),
		...pick(node, ['type']),
		focusSection,
		mainComponent: convertIntoSComponent(node.mainComponent),
	})
}
