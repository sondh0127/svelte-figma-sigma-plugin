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
	SFrameNode,
	SDefaultFrameMixin,
	SGroupNode,
	SReactionMixin,
	SExportMixin,
	SRectangleNode,
	SDefaultShapeMixin,
	SEllipseNode,
	SLineNode,
	SVectorNode,
	STextNode,
} from './types'
import { cloneObject } from '../utilities/object/clone-object'
import { getBoundingRect } from '../helper'

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

		// TODO: place getBoundingRect with  computeBoundingBox
		const boundingRect2 = computeBoundingBox(node as any)

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
	const effects = cloneObject(node.effects) as SBlendMixin['effects']

	return {
		...pick(node, ['opacity', 'blendMode', 'isMask', 'effectStyleId']),
		effects,
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

const convertSBase = (node: BaseNodeMixin): SBaseNodeMixin => {
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
		...convertSBase(node),
		children: [],
		...convertSContainer(node),
		...convertSGeometry(node),
		...convertSRectangleCorner(node),
		...convertSCorner(node),
		...convertSBlend(node),
		...convertSConstraint(node),
		...convertSLayout(node),
		...convertSExport(node),
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

const convertSReaction = (node: ReactionMixin): SReactionMixin => {
	const reactions = cloneObject(node.reactions) as SReactionMixin['reactions']
	return {
		reactions,
	}
}

const convertSDefaultFrame = (node: DefaultFrameMixin): SDefaultFrameMixin => {
	const reactions = cloneObject(
		node.reactions,
	) as SDefaultFrameMixin['reactions']
	return {
		...convertSBaseFrame(node),
		...pick(node, [
			'overflowDirection',
			'numberOfFixedChildren',
			'overlayPositionType',
			'overlayBackground',
			'overlayBackgroundInteraction',
		]),
		...convertSReaction(node),
	}
}

const convertSScene = (node: SceneNodeMixin): SSceneNodeMixin => {
	return {
		...pick(node, ['locked', 'visible']),
	}
}

const convertSExport = (node: ExportMixin): SExportMixin => {
	const exportSettings = cloneObject(
		node.exportSettings,
	) as SExportMixin['exportSettings']

	return {
		exportSettings,
	}
}

const convertSDefaultShape = (node: DefaultShapeMixin): SDefaultShapeMixin => {
	const reactions = cloneObject(
		node.reactions,
	) as SDefaultFrameMixin['reactions']
	return {
		...pick(node, []),
		...convertSBase(node),
		...convertSScene(node),
		reactions,
		...convertSBlend(node),
		...convertSGeometry(node),
		...convertSLayout(node),
		...convertSExport(node),
	}
}

// Nodes Conversion

export const convertIntoSComponent = (node: ComponentNode): SComponentNode => {
	const documentationLinks = cloneObject(
		node.documentationLinks,
	) as SComponentNode['documentationLinks']
	return {
		...convertSDefaultFrame(node),
		...pick(node, ['type', 'remote', 'key', 'description']),
		documentationLinks,
	}
}

type ComponentTag = 'Keypad' | 'Button'

export const convertIntoSInstance = (node: InstanceNode): SInstanceNode => {
	let interactions = []
	const includeComponents = ['Button']
	const mainComponentName = node.mainComponent.name

	if (includeComponents.includes(mainComponentName)) {
		try {
			interactions = JSON.parse(node.getPluginData('interactions'))
		} catch (error) {
			interactions = []
		}
	}
	return {
		...convertSDefaultFrame(node),
		...pick(node, ['type']),
		interactions,
		mainComponent: convertIntoSComponent(node.mainComponent),
	}
}

export const convertIntoSFrame = (node: FrameNode): SFrameNode => {
	let focusSection = {}
	try {
		focusSection = JSON.parse(node.getPluginData('focusSection'))
	} catch (error) {
		focusSection = {}
	}
	// convertToAutoLayout
	return {
		...convertSDefaultFrame(node),
		...pick(node, ['type']),
		focusSection,
	}
}

export const convertIntoSGroup = (node: GroupNode): SGroupNode => {
	// convertToAutoLayout
	return {
		...pick(node, ['type']),
		...convertSBase(node),
		...convertSScene(node),
		...convertSReaction(node),
		children: [],
		...convertSContainer(node),
		...convertSBlend(node),
		...convertSLayout(node),
		...convertSExport(node),
	}
}

export const convertIntoSRectangle = (node: RectangleNode): SRectangleNode => {
	return {
		...pick(node, ['type']),
		...convertSDefaultShape(node),
		...convertSConstraint(node),
		...convertSCorner(node),
		...convertSRectangleCorner(node),
	}
}

export const convertIntoSEllipse = (node: EllipseNode): SEllipseNode => {
	return {
		...pick(node, ['type', 'arcData']),
		...convertSDefaultShape(node),
		...convertSConstraint(node),
		...convertSCorner(node),
	}
}

export const convertIntoSLine = (node: LineNode): SLineNode => {
	return {
		...pick(node, ['type']),
		...convertSDefaultShape(node),
		...convertSConstraint(node),
	}
}

export const convertIntoSVectorNode = (node: VectorNode): SVectorNode => {
	const vectorNetwork = cloneObject(
		node.vectorNetwork,
	) as SVectorNode['vectorNetwork']

	const vectorPaths = cloneObject(
		node.vectorPaths,
	) as SVectorNode['vectorPaths']

	const handleMirroring = cloneObject(
		node.handleMirroring,
	) as SVectorNode['handleMirroring']

	return {
		...pick(node, ['type']),
		...convertSDefaultShape(node),
		...convertSConstraint(node),
		...convertSCorner(node),
		vectorNetwork,
		vectorPaths,
		handleMirroring,
	}
}

export const convertIntoSTextNode = (node: TextNode): STextNode => {
	const textStyleId = cloneObject(node.textStyleId) as STextNode['textStyleId']
	const fontSize = cloneObject(node.fontSize) as STextNode['fontSize']
	const fontName = cloneObject(node.fontName) as STextNode['fontName']
	const textCase = cloneObject(node.textCase) as STextNode['textCase']
	const letterSpacing = cloneObject(
		node.letterSpacing,
	) as STextNode['letterSpacing']
	const textDecoration = cloneObject(
		node.textDecoration,
	) as STextNode['textDecoration']
	const lineHeight = cloneObject(node.lineHeight) as STextNode['lineHeight']

	return {
		...pick(node, [
			'type',
			'hasMissingFont',
			'textAlignHorizontal',
			'textAlignVertical',
			'textAutoResize',
			'paragraphIndent',
			'paragraphSpacing',
			'autoRename',
			'characters',
		]),
		...convertSDefaultShape(node),
		...convertSConstraint(node),
		textStyleId,
		fontSize,
		fontName,
		textCase,
		letterSpacing,
		textDecoration,
		lineHeight,
	}
}
