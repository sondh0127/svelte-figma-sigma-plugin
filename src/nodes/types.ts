export interface PluginAPI {
	apiVersion: '1.0.0'
	command: string

	fileKey: string | undefined

	viewport: ViewportAPI
	closePlugin(message?: string): void

	notify(message: string, options?: NotificationOptions): NotificationHandler

	showUI(html: string, options?: ShowUIOptions): void
	ui: UIAPI

	clientStorage: ClientStorageAPI

	getNodeById(id: string): SBaseNode | null
	getStyleById(id: string): BaseStyle | null

	root: SDocumentNode
	currentPage: SPageNode

	on(
		type: 'selectionchange' | 'currentpagechange' | 'close',
		callback: () => void,
	): void
	once(
		type: 'selectionchange' | 'currentpagechange' | 'close',
		callback: () => void,
	): void
	off(
		type: 'selectionchange' | 'currentpagechange' | 'close',
		callback: () => void,
	): void

	readonly mixed: unique symbol

	createRectangle(): SRectangleNode
	createLine(): SLineNode
	createEllipse(): SEllipseNode
	createPolygon(): PolygonNode
	createStar(): StarNode
	createVector(): SVectorNode
	createText(): STextNode
	createFrame(): SFrameNode
	createComponent(): SComponentNode
	createPage(): SPageNode
	createSlice(): SliceNode
	/**
	 * [DEPRECATED]: This API often fails to create a valid boolean operation. Use figma.union, figma.subtract, figma.intersect and figma.exclude instead.
	 */
	createBooleanOperation(): BooleanOperationNode

	createPaintStyle(): PaintStyle
	createTextStyle(): TextStyle
	createEffectStyle(): EffectStyle
	createGridStyle(): GridStyle

	// The styles are returned in the same order as displayed in the UI. Only
	// local styles are returned. Never styles from team library.
	getLocalPaintStyles(): PaintStyle[]
	getLocalTextStyles(): TextStyle[]
	getLocalEffectStyles(): EffectStyle[]
	getLocalGridStyles(): GridStyle[]

	moveLocalPaintStyleAfter(
		targetNode: PaintStyle,
		reference: PaintStyle | null,
	): void
	moveLocalTextStyleAfter(
		targetNode: TextStyle,
		reference: TextStyle | null,
	): void
	moveLocalEffectStyleAfter(
		targetNode: EffectStyle,
		reference: EffectStyle | null,
	): void
	moveLocalGridStyleAfter(
		targetNode: GridStyle,
		reference: GridStyle | null,
	): void

	moveLocalPaintFolderAfter(
		targetFolder: string,
		reference: string | null,
	): void
	moveLocalTextFolderAfter(targetFolder: string, reference: string | null): void
	moveLocalEffectFolderAfter(
		targetFolder: string,
		reference: string | null,
	): void
	moveLocalGridFolderAfter(targetFolder: string, reference: string | null): void

	importComponentByKeyAsync(key: string): Promise<SComponentNode>
	importComponentSetByKeyAsync(key: string): Promise<ComponentSetNode>
	importStyleByKeyAsync(key: string): Promise<BaseStyle>

	listAvailableFontsAsync(): Promise<Font[]>
	loadFontAsync(fontName: FontName): Promise<void>
	hasMissingFont: boolean

	createNodeFromSvg(svg: string): SFrameNode

	createImage(data: Uint8Array): Image
	getImageByHash(hash: string): Image

	combineAsVariants(
		nodes: ReadonlyArray<SComponentNode>,
		parent: SBaseNode & SChildrenMixin,
		index?: number,
	): ComponentSetNode
	group(
		nodes: ReadonlyArray<SBaseNode>,
		parent: SBaseNode & SChildrenMixin,
		index?: number,
	): SGroupNode
	flatten(
		nodes: ReadonlyArray<SBaseNode>,
		parent?: SBaseNode & SChildrenMixin,
		index?: number,
	): SVectorNode

	union(
		nodes: ReadonlyArray<SBaseNode>,
		parent: SBaseNode & SChildrenMixin,
		index?: number,
	): BooleanOperationNode
	subtract(
		nodes: ReadonlyArray<SBaseNode>,
		parent: SBaseNode & SChildrenMixin,
		index?: number,
	): BooleanOperationNode
	intersect(
		nodes: ReadonlyArray<SBaseNode>,
		parent: SBaseNode & SChildrenMixin,
		index?: number,
	): BooleanOperationNode
	exclude(
		nodes: ReadonlyArray<SBaseNode>,
		parent: SBaseNode & SChildrenMixin,
		index?: number,
	): BooleanOperationNode
}

interface ClientStorageAPI {
	getAsync(key: string): Promise<any | undefined>
	setAsync(key: string, value: any): Promise<void>
}

interface NotificationOptions {
	timeout?: number
}

interface NotificationHandler {
	cancel: () => void
}

interface ShowUIOptions {
	visible?: boolean
	width?: number
	height?: number
}

interface UIPostMessageOptions {
	origin?: string
}

interface OnMessageProperties {
	origin: string
}

type MessageEventHandler = (
	pluginMessage: any,
	props: OnMessageProperties,
) => void

interface UIAPI {
	show(): void
	hide(): void
	resize(width: number, height: number): void
	close(): void

	postMessage(pluginMessage: any, options?: UIPostMessageOptions): void
	onmessage: MessageEventHandler | undefined
	on(type: 'message', callback: MessageEventHandler): void
	once(type: 'message', callback: MessageEventHandler): void
	off(type: 'message', callback: MessageEventHandler): void
}

interface ViewportAPI {
	center: Vector
	zoom: number
	scrollAndZoomIntoView(nodes: ReadonlyArray<SBaseNode>): void
	bounds: Rect
}

////////////////////////////////////////////////////////////////////////////////
// Datatypes

type Transform = [[number, number, number], [number, number, number]]

interface Vector {
	x: number
	y: number
}

interface Rect {
	x: number
	y: number
	width: number
	height: number
}

interface RGB {
	r: number
	g: number
	b: number
}

interface RGBA {
	r: number
	g: number
	b: number
	a: number
}

interface FontName {
	family: string
	style: string
}

type TextCase = 'ORIGINAL' | 'UPPER' | 'LOWER' | 'TITLE'

type TextDecoration = 'NONE' | 'UNDERLINE' | 'STRIKETHROUGH'

interface ArcData {
	startingAngle: number
	endingAngle: number
	innerRadius: number
}

interface ShadowEffect {
	type: 'DROP_SHADOW' | 'INNER_SHADOW'
	color: RGBA
	offset: Vector
	radius: number
	spread?: number
	visible: boolean
	blendMode: BlendMode
}

interface BlurEffect {
	type: 'LAYER_BLUR' | 'BACKGROUND_BLUR'
	radius: number
	visible: boolean
}

type Effect = ShadowEffect | BlurEffect

type ConstraintType = 'MIN' | 'CENTER' | 'MAX' | 'STRETCH' | 'SCALE'

interface Constraints {
	horizontal: ConstraintType
	vertical: ConstraintType
}

interface ColorStop {
	position: number
	color: RGBA
}

interface ImageFilters {
	exposure?: number
	contrast?: number
	saturation?: number
	temperature?: number
	tint?: number
	highlights?: number
	shadows?: number
}

interface SSolidPaint {
	type: 'SOLID'
	color: RGB

	visible?: boolean
	opacity?: number
	blendMode?: BlendMode
}

interface SGradientPaint {
	type:
		| 'GRADIENT_LINEAR'
		| 'GRADIENT_RADIAL'
		| 'GRADIENT_ANGULAR'
		| 'GRADIENT_DIAMOND'
	gradientTransform: Transform
	gradientStops: Array<ColorStop>

	visible?: boolean
	opacity?: number
	blendMode?: BlendMode
}

interface SImagePaint {
	type: 'IMAGE'
	scaleMode: 'FILL' | 'FIT' | 'CROP' | 'TILE'
	imageHash: string | null
	imageTransform?: Transform // setting for "CROP"
	scalingFactor?: number // setting for "TILE"
	filters?: ImageFilters

	visible?: boolean
	opacity?: number
	blendMode?: BlendMode
}

type SPaint = SSolidPaint | SGradientPaint | SImagePaint

interface Guide {
	axis: 'X' | 'Y'
	offset: number
}

interface RowsColsLayoutGrid {
	pattern: 'ROWS' | 'COLUMNS'
	alignment: 'MIN' | 'MAX' | 'STRETCH' | 'CENTER'
	gutterSize: number

	count: number // Infinity when "Auto" is set in the UI
	sectionSize?: number // Not set for alignment: "STRETCH"
	offset?: number // Not set for alignment: "CENTER"

	visible?: boolean
	color?: RGBA
}

interface GridLayoutGrid {
	pattern: 'GRID'
	sectionSize: number

	visible?: boolean
	color?: RGBA
}

type LayoutGrid = RowsColsLayoutGrid | GridLayoutGrid

interface ExportSettingsConstraints {
	type: 'SCALE' | 'WIDTH' | 'HEIGHT'
	value: number
}

interface ExportSettingsImage {
	format: 'JPG' | 'PNG'
	contentsOnly?: boolean // defaults to true
	suffix?: string
	constraint?: ExportSettingsConstraints
}

interface ExportSettingsSVG {
	format: 'SVG'
	contentsOnly?: boolean // defaults to true
	suffix?: string
	svgOutlineText?: boolean // defaults to true
	svgIdAttribute?: boolean // defaults to false
	svgSimplifyStroke?: boolean // defaults to true
}

interface ExportSettingsPDF {
	format: 'PDF'
	contentsOnly?: boolean // defaults to true
	suffix?: string
}

type ExportSettings =
	| ExportSettingsImage
	| ExportSettingsSVG
	| ExportSettingsPDF

type WindingRule = 'NONZERO' | 'EVENODD'

interface VectorVertex {
	x: number
	y: number
	strokeCap?: StrokeCap
	strokeJoin?: StrokeJoin
	cornerRadius?: number
	handleMirroring?: HandleMirroring
}

interface VectorSegment {
	start: number
	end: number
	tangentStart?: Vector // Defaults to { x: 0, y: 0 }
	tangentEnd?: Vector // Defaults to { x: 0, y: 0 }
}

interface VectorRegion {
	windingRule: WindingRule
	loops: ReadonlyArray<ReadonlyArray<number>>
}

interface VectorNetwork {
	vertices: Array<VectorVertex>
	segments: Array<VectorSegment>
	regions?: Array<VectorRegion> // Defaults to []
}

interface VectorPath {
	windingRule: WindingRule | 'NONE'
	data: string
}

type VectorPaths = Array<VectorPath>

interface LetterSpacing {
	value: number
	unit: 'PIXELS' | 'PERCENT'
}

type LineHeight =
	| {
			value: number
			unit: 'PIXELS' | 'PERCENT'
	  }
	| {
			unit: 'AUTO'
	  }

type BlendMode =
	| 'NORMAL'
	| 'DARKEN'
	| 'MULTIPLY'
	| 'LINEAR_BURN'
	| 'COLOR_BURN'
	| 'LIGHTEN'
	| 'SCREEN'
	| 'LINEAR_DODGE'
	| 'COLOR_DODGE'
	| 'OVERLAY'
	| 'SOFT_LIGHT'
	| 'HARD_LIGHT'
	| 'DIFFERENCE'
	| 'EXCLUSION'
	| 'HUE'
	| 'SATURATION'
	| 'COLOR'
	| 'LUMINOSITY'

interface Font {
	fontName: FontName
}

type SReaction = { action: SAction; trigger: STrigger }
export type SInteraction = { action: SAction; trigger: STrigger }

export type SAction =
	| { type: 'SELECT'; option: string }
	| { type: 'BACK' | 'CLOSE' }
	| { type: 'URL'; url: string }
	| {
			type: 'NODE'
			destinationId: string | null
			navigation: Navigation
			transition: Transition | null
			preserveScrollPosition: boolean

			// Only present if navigation == "OVERLAY" and the destination uses
			// overlay position type "RELATIVE"
			overlayRelativePosition?: Vector
	  }

interface SimpleTransition {
	type: 'DISSOLVE' | 'SMART_ANIMATE' | 'SCROLL_ANIMATE'
	easing: Easing
	duration: number
}

interface DirectionalTransition {
	type: 'MOVE_IN' | 'MOVE_OUT' | 'PUSH' | 'SLIDE_IN' | 'SLIDE_OUT'
	direction: 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM'
	matchLayers: boolean

	easing: Easing
	duration: number
}

type Transition = SimpleTransition | DirectionalTransition

export type STrigger =
	| { type: 'ON_CLICK' | 'ON_HOVER' | 'ON_PRESS' | 'ON_DRAG' }
	| { type: 'AFTER_TIMEOUT'; timeout: number }
	| {
			type: 'MOUSE_ENTER' | 'MOUSE_LEAVE' | 'MOUSE_UP' | 'MOUSE_DOWN'
			delay: number
	  }

type Navigation = 'NAVIGATE' | 'SWAP' | 'OVERLAY' | 'SCROLL_TO' | 'CHANGE_TO'

interface Easing {
	type: 'EASE_IN' | 'EASE_OUT' | 'EASE_IN_AND_OUT' | 'LINEAR'
	easingFunctionCubicBezier?: EasingFunctionBezier
}

interface EasingFunctionBezier {
	x1: number
	y1: number
	x2: number
	y2: number
}

type OverflowDirection = 'NONE' | 'HORIZONTAL' | 'VERTICAL' | 'BOTH'

type OverlayPositionType =
	| 'CENTER'
	| 'TOP_LEFT'
	| 'TOP_CENTER'
	| 'TOP_RIGHT'
	| 'BOTTOM_LEFT'
	| 'BOTTOM_CENTER'
	| 'BOTTOM_RIGHT'
	| 'MANUAL'

type OverlayBackground = { type: 'NONE' } | { type: 'SOLID_COLOR'; color: RGBA }

type OverlayBackgroundInteraction = 'NONE' | 'CLOSE_ON_CLICK_OUTSIDE'

type PublishStatus = 'UNPUBLISHED' | 'CURRENT' | 'CHANGED'

////////////////////////////////////////////////////////////////////////////////
// Mixins

export interface SBaseNodeMixin {
	id: string
	parent: (SBaseNode & SChildrenMixin) | null
	name: string // Note: setting this also sets `autoRename` to false on TextNodes
	//  removed: boolean
	// toString(): string
	// remove(): void

	// getPluginData(key: string): string
	// setPluginData(key: string, value: string): void

	// // Namespace is a string that must be at least 3 alphanumeric characters, and should
	// // be a name related to your plugin. Other plugins will be able to read this data.
	// getSharedPluginData(namespace: string, key: string): string
	// setSharedPluginData(namespace: string, key: string, value: string): void
	// setRelaunchData(data: { [command: string]: /* description */ string }): void
}

export interface SSceneNodeMixin {
	visible: boolean
	locked: boolean
}

export interface SChildrenMixin {
	children: Array<SSceneNode>
	// appendChild(child: SceneNode): void
	// insertChild(index: number, child: SceneNode): void
	// findChildren(callback?: (node: SceneNode) => boolean): SceneNode[]
	// findChild(callback: (node: SceneNode) => boolean): SceneNode | null
	// /**
	//  * If you only need to search immediate children, it is much faster
	//  * to call node.children.filter(callback) or node.findChildren(callback)
	//  */
	// findAll(callback?: (node: SceneNode) => boolean): SceneNode[]
	// /**
	//  * If you only need to search immediate children, it is much faster
	//  * to call node.children.find(callback) or node.findChild(callback)
	//  */
	// findOne(callback: (node: SceneNode) => boolean): SceneNode | null
}

export interface SConstraintMixin {
	constraints: Constraints
}

export interface SLayoutMixin {
	absoluteTransform: Transform
	relativeTransform: Transform
	x: number
	y: number
	rotation: number // In degrees

	width: number
	height: number
	constrainProportions: boolean

	layoutAlign: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH' | 'INHERIT' // applicable only inside auto-layout frames
	layoutGrow: number

	// resize(width: number, height: number): void
	// resizeWithoutConstraints(width: number, height: number): void
	// rescale(scale: number): void
}

export interface SBlendMixin {
	opacity: number
	blendMode: 'PASS_THROUGH' | BlendMode
	isMask: boolean
	effects: Array<Effect>
	effectStyleId: string
}

export interface SContainerMixin {
	expanded: boolean
	// backgrounds: Array<Paint> // DEPRECATED: use 'fills' instead
	// backgroundStyleId: string // DEPRECATED: use 'fillStyleId' instead
}

type StrokeCap =
	| 'NONE'
	| 'ROUND'
	| 'SQUARE'
	| 'ARROW_LINES'
	| 'ARROW_EQUILATERAL'
type StrokeJoin = 'MITER' | 'BEVEL' | 'ROUND'
type HandleMirroring = 'NONE' | 'ANGLE' | 'ANGLE_AND_LENGTH'

export interface SGeometryMixin {
	fills: Array<SPaint> | PluginAPI['mixed']
	strokes: Array<SPaint>
	strokeWeight: number
	strokeMiterLimit: number
	strokeAlign: 'CENTER' | 'INSIDE' | 'OUTSIDE'
	strokeCap: StrokeCap | PluginAPI['mixed']
	strokeJoin: StrokeJoin | PluginAPI['mixed']
	dashPattern: Array<number>
	fillStyleId: string | PluginAPI['mixed']
	strokeStyleId: string
	// outlineStroke(): VectorNode | null
}

export interface SCornerMixin {
	cornerRadius: number
	cornerSmoothing: number
}

export interface SRectangleCornerMixin {
	topLeftRadius: number
	topRightRadius: number
	bottomLeftRadius: number
	bottomRightRadius: number
}

export interface SExportMixin {
	exportSettings: Array<ExportSettings>
	// exportAsync(settings?: ExportSettings): Promise<Uint8Array> // Defaults to PNG format
}

interface SFramePrototypingMixin {
	overflowDirection: OverflowDirection
	numberOfFixedChildren: number

	overlayPositionType: OverlayPositionType
	overlayBackground: OverlayBackground
	overlayBackgroundInteraction: OverlayBackgroundInteraction
}

export interface SReactionMixin {
	reactions: Array<SReaction>
}

interface DocumentationLink {
	uri: string
}

interface PublishableMixin {
	description: string
	documentationLinks: Array<DocumentationLink>
	remote: boolean
	key: string // The key to use with "importComponentByKeyAsync", "importComponentSetByKeyAsync", and "importStyleByKeyAsync"
	// getPublishStatusAsync(): Promise<PublishStatus>
}

export interface SDefaultShapeMixin
	extends SBaseNodeMixin,
		SSceneNodeMixin,
		SReactionMixin,
		SBlendMixin,
		SGeometryMixin,
		SLayoutMixin,
		SExportMixin {}

export interface SBaseFrameMixin
	extends SBaseNodeMixin,
		SSceneNodeMixin,
		SChildrenMixin,
		SContainerMixin,
		SGeometryMixin,
		SCornerMixin,
		SRectangleCornerMixin,
		SBlendMixin,
		SConstraintMixin,
		SLayoutMixin,
		SExportMixin {
	layoutMode: 'NONE' | 'HORIZONTAL' | 'VERTICAL'
	primaryAxisSizingMode: 'FIXED' | 'AUTO' // applicable only if layoutMode != "NONE"
	counterAxisSizingMode: 'FIXED' | 'AUTO' // applicable only if layoutMode != "NONE"

	primaryAxisAlignItems: 'MIN' | 'MAX' | 'CENTER' | 'SPACE_BETWEEN' // applicable only if layoutMode != "NONE"
	counterAxisAlignItems: 'MIN' | 'MAX' | 'CENTER' // applicable only if layoutMode != "NONE"

	paddingLeft: number // applicable only if layoutMode != "NONE"
	paddingRight: number // applicable only if layoutMode != "NONE"
	paddingTop: number // applicable only if layoutMode != "NONE"
	paddingBottom: number // applicable only if layoutMode != "NONE"
	itemSpacing: number // applicable only if layoutMode != "NONE"

	// horizontalPadding: number // DEPRECATED: use the individual paddings
	// verticalPadding: number // DEPRECATED: use the individual paddings

	layoutGrids: Array<LayoutGrid>
	gridStyleId: string
	clipsContent: boolean
	guides: Array<Guide>
}

export interface SDefaultFrameMixin
	extends SBaseFrameMixin,
		SFramePrototypingMixin,
		SReactionMixin {}

////////////////////////////////////////////////////////////////////////////////
// Nodes

interface SDocumentNode extends SBaseNodeMixin {
	/* 	 type: 'DOCUMENT'

	 children: ReadonlyArray<PageNode> */
	/* 	appendChild(child: PageNode): void
	insertChild(index: number, child: PageNode): void
	findChildren(callback?: (node: PageNode) => boolean): Array<PageNode>
	findChild(callback: (node: PageNode) => boolean): PageNode | null

	findAll(
		callback?: (node: PageNode | SSceneNode) => boolean,
	): Array<PageNode | SSceneNode>

	findOne(
		callback: (node: PageNode | SSceneNode) => boolean,
	): PageNode | SSceneNode | null */
}

interface SInteractionMixin {
	interactions: Array<SInteraction>
}

interface SPageNode extends SBaseNodeMixin, SChildrenMixin, SExportMixin {
	type: 'PAGE'
	/* 	clone(): SPageNode

	guides: ReadonlyArray<Guide>
	selection: ReadonlyArray<SSceneNode>
	selectedTextRange: { node: TextNode; start: number; end: number } | null

	backgrounds: ReadonlyArray<Paint>

	 prototypeStartNode:
		| FrameNode
		| GroupNode
		| SComponentNode
		| SInstanceNode
		| null */
}

interface FocusSectionConfig {
	straightOnly: boolean
	straightOverlapThreshold: number
	rememberSource: boolean
	disabled: boolean
	defaultElement: string
	enterTo: string
	leaveFor: string | null
	restrict: string
	tabIndexIgnoreList: string
	navigableFilter: string | null
	scrollOptions: { behavior: string; block: string }
}

interface SFocusSectionMixin {
	focusSection: {
		config?: FocusSectionConfig
		id?: string
		default?: boolean
	}
}

export interface SFrameNode extends SDefaultFrameMixin, SFocusSectionMixin {
	type: 'FRAME'
	// clone(): SFrameNode
}

export interface SGroupNode
	extends SBaseNodeMixin,
		SSceneNodeMixin,
		SReactionMixin,
		SChildrenMixin,
		SContainerMixin,
		SBlendMixin,
		SLayoutMixin,
		SExportMixin {
	type: 'GROUP'
	// clone(): SGroupNode
}

interface SliceNode
	extends SBaseNodeMixin,
		SSceneNodeMixin,
		SLayoutMixin,
		SExportMixin {
	type: 'SLICE'
	clone(): SliceNode
}

export interface SRectangleNode
	extends SDefaultShapeMixin,
		SConstraintMixin,
		SCornerMixin,
		SRectangleCornerMixin {
	type: 'RECTANGLE'
	// clone(): SRectangleNode
}

export interface SLineNode extends SDefaultShapeMixin, SConstraintMixin {
	type: 'LINE'
	// clone(): LineNode
}

export interface SEllipseNode
	extends SDefaultShapeMixin,
		SConstraintMixin,
		SCornerMixin {
	type: 'ELLIPSE'
	// clone(): SEllipseNode
	arcData: ArcData
}

interface PolygonNode
	extends SDefaultShapeMixin,
		SConstraintMixin,
		SCornerMixin {
	type: 'POLYGON'
	clone(): PolygonNode
	pointCount: number
}

interface StarNode extends SDefaultShapeMixin, SConstraintMixin, SCornerMixin {
	type: 'STAR'
	clone(): StarNode
	pointCount: number
	innerRadius: number
}

export interface SVectorNode
	extends SDefaultShapeMixin,
		SConstraintMixin,
		SCornerMixin {
	type: 'VECTOR'
	// clone(): VectorNode
	vectorNetwork: VectorNetwork
	vectorPaths: VectorPaths
	handleMirroring: HandleMirroring
}

export interface STextNode extends SDefaultShapeMixin, SConstraintMixin {
	type: 'TEXT'
	// clone(): STextNode
	hasMissingFont: boolean
	textAlignHorizontal: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED'
	textAlignVertical: 'TOP' | 'CENTER' | 'BOTTOM'
	textAutoResize: 'NONE' | 'WIDTH_AND_HEIGHT' | 'HEIGHT'
	paragraphIndent: number
	paragraphSpacing: number
	autoRename: boolean

	textStyleId: string | PluginAPI['mixed']
	fontSize: number | PluginAPI['mixed']
	fontName: FontName | PluginAPI['mixed']
	textCase: TextCase | PluginAPI['mixed']
	textDecoration: TextDecoration | PluginAPI['mixed']
	letterSpacing: LetterSpacing | PluginAPI['mixed']
	lineHeight: LineHeight | PluginAPI['mixed']

	characters: string
	// insertCharacters(
	// 	start: number,
	// 	characters: string,
	// 	useStyle?: 'BEFORE' | 'AFTER',
	// ): void
	// deleteCharacters(start: number, end: number): void

	// getRangeFontSize(start: number, end: number): number | PluginAPI['mixed']
	// setRangeFontSize(start: number, end: number, value: number): void
	// getRangeFontName(start: number, end: number): FontName | PluginAPI['mixed']
	// setRangeFontName(start: number, end: number, value: FontName): void
	// getRangeTextCase(start: number, end: number): TextCase | PluginAPI['mixed']
	// setRangeTextCase(start: number, end: number, value: TextCase): void
	// getRangeTextDecoration(
	// 	start: number,
	// 	end: number,
	// ): TextDecoration | PluginAPI['mixed']
	// setRangeTextDecoration(
	// 	start: number,
	// 	end: number,
	// 	value: TextDecoration,
	// ): void
	// getRangeLetterSpacing(
	// 	start: number,
	// 	end: number,
	// ): LetterSpacing | PluginAPI['mixed']
	// setRangeLetterSpacing(start: number, end: number, value: LetterSpacing): void
	// getRangeLineHeight(
	// 	start: number,
	// 	end: number,
	// ): LineHeight | PluginAPI['mixed']
	// setRangeLineHeight(start: number, end: number, value: LineHeight): void
	// getRangeFills(start: number, end: number): SPaint[] | PluginAPI['mixed']
	// setRangeFills(start: number, end: number, value: SPaint[]): void
	// getRangeTextStyleId(start: number, end: number): string | PluginAPI['mixed']
	// setRangeTextStyleId(start: number, end: number, value: string): void
	// getRangeFillStyleId(start: number, end: number): string | PluginAPI['mixed']
	// setRangeFillStyleId(start: number, end: number, value: string): void
}

interface ComponentSetNode extends SBaseFrameMixin, PublishableMixin {
	type: 'COMPONENT_SET'
	clone(): ComponentSetNode
	defaultVariant: SComponentNode
}

export interface SComponentNode extends SDefaultFrameMixin, PublishableMixin {
	type: 'COMPONENT'
	// clone(): SComponentNode
	// createInstance(): SInstanceNode
}

export interface SInstanceNode extends SDefaultFrameMixin, SInteractionMixin {
	type: 'INSTANCE'
	// clone(): SInstanceNode
	mainComponent: SComponentNode | null
	// swapComponent(componentNode: ComponentNode): void
	// detachInstance(): FrameNode
	// scaleFactor: number
}

interface BooleanOperationNode
	extends SDefaultShapeMixin,
		SChildrenMixin,
		SCornerMixin {
	type: 'BOOLEAN_OPERATION'
	clone(): BooleanOperationNode
	booleanOperation: 'UNION' | 'INTERSECT' | 'SUBTRACT' | 'EXCLUDE'

	expanded: boolean
}

export type SBaseNode = SDocumentNode | SPageNode | SSceneNode

export type SSceneNode =
	| SliceNode
	| SFrameNode
	| SGroupNode
	| ComponentSetNode
	| SComponentNode
	| SInstanceNode
	| BooleanOperationNode
	| SVectorNode
	| StarNode
	| SLineNode
	| SEllipseNode
	| PolygonNode
	| SRectangleNode
	| STextNode

type NodeType =
	| 'DOCUMENT'
	| 'PAGE'
	| 'SLICE'
	| 'FRAME'
	| 'GROUP'
	| 'COMPONENT_SET'
	| 'COMPONENT'
	| 'INSTANCE'
	| 'BOOLEAN_OPERATION'
	| 'VECTOR'
	| 'STAR'
	| 'LINE'
	| 'ELLIPSE'
	| 'POLYGON'
	| 'RECTANGLE'
	| 'TEXT'

////////////////////////////////////////////////////////////////////////////////
// Styles
type StyleType = 'PAINT' | 'TEXT' | 'EFFECT' | 'GRID'

interface BaseStyle extends PublishableMixin {
	id: string
	type: StyleType
	name: string
	remove(): void
}

interface PaintStyle extends BaseStyle {
	type: 'PAINT'
	paints: ReadonlyArray<SPaint>
}

interface TextStyle extends BaseStyle {
	type: 'TEXT'
	fontSize: number
	textDecoration: TextDecoration
	fontName: FontName
	letterSpacing: LetterSpacing
	lineHeight: LineHeight
	paragraphIndent: number
	paragraphSpacing: number
	textCase: TextCase
}

interface EffectStyle extends BaseStyle {
	type: 'EFFECT'
	effects: ReadonlyArray<Effect>
}

interface GridStyle extends BaseStyle {
	type: 'GRID'
	layoutGrids: ReadonlyArray<LayoutGrid>
}

////////////////////////////////////////////////////////////////////////////////
// Other

interface Image {
	hash: string
	getBytesAsync(): Promise<Uint8Array>
}
