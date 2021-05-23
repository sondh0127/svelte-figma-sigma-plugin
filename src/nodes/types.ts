export interface PluginAPI {
	readonly apiVersion: '1.0.0'
	readonly command: string

	readonly fileKey: string | undefined

	readonly viewport: ViewportAPI
	closePlugin(message?: string): void

	notify(message: string, options?: NotificationOptions): NotificationHandler

	showUI(html: string, options?: ShowUIOptions): void
	readonly ui: UIAPI

	readonly clientStorage: ClientStorageAPI

	getNodeById(id: string): SBaseNode | null
	getStyleById(id: string): BaseStyle | null

	readonly root: SDocumentNode
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

	createRectangle(): RectangleNode
	createLine(): LineNode
	createEllipse(): EllipseNode
	createPolygon(): PolygonNode
	createStar(): StarNode
	createVector(): VectorNode
	createText(): TextNode
	createFrame(): FrameNode
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
	readonly hasMissingFont: boolean

	createNodeFromSvg(svg: string): FrameNode

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
	): GroupNode
	flatten(
		nodes: ReadonlyArray<SBaseNode>,
		parent?: SBaseNode & SChildrenMixin,
		index?: number,
	): VectorNode

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
	readonly bounds: Rect
}

////////////////////////////////////////////////////////////////////////////////
// Datatypes

type Transform = [[number, number, number], [number, number, number]]

interface Vector {
	readonly x: number
	readonly y: number
}

interface Rect {
	readonly x: number
	readonly y: number
	readonly width: number
	readonly height: number
}

interface RGB {
	readonly r: number
	readonly g: number
	readonly b: number
}

interface RGBA {
	readonly r: number
	readonly g: number
	readonly b: number
	readonly a: number
}

interface FontName {
	readonly family: string
	readonly style: string
}

type TextCase = 'ORIGINAL' | 'UPPER' | 'LOWER' | 'TITLE'

type TextDecoration = 'NONE' | 'UNDERLINE' | 'STRIKETHROUGH'

interface ArcData {
	readonly startingAngle: number
	readonly endingAngle: number
	readonly innerRadius: number
}

interface ShadowEffect {
	readonly type: 'DROP_SHADOW' | 'INNER_SHADOW'
	readonly color: RGBA
	readonly offset: Vector
	readonly radius: number
	readonly spread?: number
	readonly visible: boolean
	readonly blendMode: BlendMode
}

interface BlurEffect {
	readonly type: 'LAYER_BLUR' | 'BACKGROUND_BLUR'
	readonly radius: number
	readonly visible: boolean
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
	readonly exposure?: number
	readonly contrast?: number
	readonly saturation?: number
	readonly temperature?: number
	readonly tint?: number
	readonly highlights?: number
	readonly shadows?: number
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
	readonly axis: 'X' | 'Y'
	readonly offset: number
}

interface RowsColsLayoutGrid {
	readonly pattern: 'ROWS' | 'COLUMNS'
	readonly alignment: 'MIN' | 'MAX' | 'STRETCH' | 'CENTER'
	readonly gutterSize: number

	readonly count: number // Infinity when "Auto" is set in the UI
	readonly sectionSize?: number // Not set for alignment: "STRETCH"
	readonly offset?: number // Not set for alignment: "CENTER"

	readonly visible?: boolean
	readonly color?: RGBA
}

interface GridLayoutGrid {
	readonly pattern: 'GRID'
	readonly sectionSize: number

	readonly visible?: boolean
	readonly color?: RGBA
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
	readonly x: number
	readonly y: number
	readonly strokeCap?: StrokeCap
	readonly strokeJoin?: StrokeJoin
	readonly cornerRadius?: number
	readonly handleMirroring?: HandleMirroring
}

interface VectorSegment {
	readonly start: number
	readonly end: number
	readonly tangentStart?: Vector // Defaults to { x: 0, y: 0 }
	readonly tangentEnd?: Vector // Defaults to { x: 0, y: 0 }
}

interface VectorRegion {
	readonly windingRule: WindingRule
	readonly loops: ReadonlyArray<ReadonlyArray<number>>
}

interface VectorNetwork {
	readonly vertices: ReadonlyArray<VectorVertex>
	readonly segments: ReadonlyArray<VectorSegment>
	readonly regions?: ReadonlyArray<VectorRegion> // Defaults to []
}

interface VectorPath {
	readonly windingRule: WindingRule | 'NONE'
	readonly data: string
}

type VectorPaths = ReadonlyArray<VectorPath>

interface LetterSpacing {
	readonly value: number
	readonly unit: 'PIXELS' | 'PERCENT'
}

type LineHeight =
	| {
			readonly value: number
			readonly unit: 'PIXELS' | 'PERCENT'
	  }
	| {
			readonly unit: 'AUTO'
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
	readonly type: 'DISSOLVE' | 'SMART_ANIMATE' | 'SCROLL_ANIMATE'
	readonly easing: Easing
	readonly duration: number
}

interface DirectionalTransition {
	readonly type: 'MOVE_IN' | 'MOVE_OUT' | 'PUSH' | 'SLIDE_IN' | 'SLIDE_OUT'
	readonly direction: 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM'
	readonly matchLayers: boolean

	readonly easing: Easing
	readonly duration: number
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
	readonly type: 'EASE_IN' | 'EASE_OUT' | 'EASE_IN_AND_OUT' | 'LINEAR'
	readonly easingFunctionCubicBezier?: EasingFunctionBezier
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

type OverlayBackground =
	| { readonly type: 'NONE' }
	| { readonly type: 'SOLID_COLOR'; readonly color: RGBA }

type OverlayBackgroundInteraction = 'NONE' | 'CLOSE_ON_CLICK_OUTSIDE'

type PublishStatus = 'UNPUBLISHED' | 'CURRENT' | 'CHANGED'

////////////////////////////////////////////////////////////////////////////////
// Mixins

export interface SBaseNodeMixin {
	id: string
	parent: (SBaseNode & SChildrenMixin) | null
	name: string // Note: setting this also sets `autoRename` to false on TextNodes
	// readonly removed: boolean
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
	effects: ReadonlyArray<Effect>
	effectStyleId: string
}

export interface SContainerMixin {
	expanded: boolean
	// backgrounds: ReadonlyArray<Paint> // DEPRECATED: use 'fills' instead
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
	fills: Array<SPaint>
	strokes: Array<SPaint>
	strokeWeight: number
	strokeMiterLimit: number
	strokeAlign: 'CENTER' | 'INSIDE' | 'OUTSIDE'
	strokeCap: StrokeCap
	strokeJoin: StrokeJoin
	dashPattern: Array<number>
	fillStyleId: string
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

interface SExportMixin {
	// exportSettings: Array<ExportSettings>
	// exportAsync(settings?: ExportSettings): Promise<Uint8Array> // Defaults to PNG format
}

interface SFramePrototypingMixin {
	/* 	overflowDirection: OverflowDirection
	numberOfFixedChildren: number

	readonly overlayPositionType: OverlayPositionType
	readonly overlayBackground: OverlayBackground
	readonly overlayBackgroundInteraction: OverlayBackgroundInteraction */
}

interface SReactionMixin {
	reactions: Array<SReaction>
}

interface SInteractionMixin {
	interactions: Array<SInteraction>
}

interface DocumentationLink {
	readonly uri: string
}

interface PublishableMixin {
	// description: string
	// documentationLinks: ReadonlyArray<DocumentationLink>
	remote: boolean
	key: string // The key to use with "importComponentByKeyAsync", "importComponentSetByKeyAsync", and "importStyleByKeyAsync"
	// getPublishStatusAsync(): Promise<PublishStatus>
}

interface DefaultShapeMixin
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

interface SDefaultFrameMixin
	extends SBaseFrameMixin,
		SFramePrototypingMixin,
		// SReactionMixin,
		SInteractionMixin {}

////////////////////////////////////////////////////////////////////////////////
// Nodes

interface SDocumentNode extends SBaseNodeMixin {
	/* 	readonly type: 'DOCUMENT'

	readonly children: ReadonlyArray<PageNode> */
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

interface SPageNode extends SBaseNodeMixin, SChildrenMixin, SExportMixin {
	readonly type: 'PAGE'
	/* 	clone(): SPageNode

	guides: ReadonlyArray<Guide>
	selection: ReadonlyArray<SSceneNode>
	selectedTextRange: { node: TextNode; start: number; end: number } | null

	backgrounds: ReadonlyArray<Paint>

	readonly prototypeStartNode:
		| FrameNode
		| GroupNode
		| SComponentNode
		| SInstanceNode
		| null */
}

interface FrameNode extends SDefaultFrameMixin {
	readonly type: 'FRAME'
	clone(): FrameNode
}

interface GroupNode
	extends SBaseNodeMixin,
		SSceneNodeMixin,
		SReactionMixin,
		SChildrenMixin,
		SContainerMixin,
		SBlendMixin,
		SLayoutMixin,
		SExportMixin {
	readonly type: 'GROUP'
	clone(): GroupNode
}

interface SliceNode
	extends SBaseNodeMixin,
		SSceneNodeMixin,
		SLayoutMixin,
		SExportMixin {
	readonly type: 'SLICE'
	clone(): SliceNode
}

interface RectangleNode
	extends DefaultShapeMixin,
		SConstraintMixin,
		SCornerMixin,
		SRectangleCornerMixin {
	readonly type: 'RECTANGLE'
	clone(): RectangleNode
}

interface LineNode extends DefaultShapeMixin, SConstraintMixin {
	readonly type: 'LINE'
	clone(): LineNode
}

interface EllipseNode
	extends DefaultShapeMixin,
		SConstraintMixin,
		SCornerMixin {
	readonly type: 'ELLIPSE'
	clone(): EllipseNode
	arcData: ArcData
}

interface PolygonNode
	extends DefaultShapeMixin,
		SConstraintMixin,
		SCornerMixin {
	readonly type: 'POLYGON'
	clone(): PolygonNode
	pointCount: number
}

interface StarNode extends DefaultShapeMixin, SConstraintMixin, SCornerMixin {
	readonly type: 'STAR'
	clone(): StarNode
	pointCount: number
	innerRadius: number
}

interface VectorNode extends DefaultShapeMixin, SConstraintMixin, SCornerMixin {
	readonly type: 'VECTOR'
	clone(): VectorNode
	vectorNetwork: VectorNetwork
	vectorPaths: VectorPaths
	handleMirroring: HandleMirroring | PluginAPI['mixed']
}

interface TextNode extends DefaultShapeMixin, SConstraintMixin {
	readonly type: 'TEXT'
	clone(): TextNode
	readonly hasMissingFont: boolean
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
	insertCharacters(
		start: number,
		characters: string,
		useStyle?: 'BEFORE' | 'AFTER',
	): void
	deleteCharacters(start: number, end: number): void

	getRangeFontSize(start: number, end: number): number | PluginAPI['mixed']
	setRangeFontSize(start: number, end: number, value: number): void
	getRangeFontName(start: number, end: number): FontName | PluginAPI['mixed']
	setRangeFontName(start: number, end: number, value: FontName): void
	getRangeTextCase(start: number, end: number): TextCase | PluginAPI['mixed']
	setRangeTextCase(start: number, end: number, value: TextCase): void
	getRangeTextDecoration(
		start: number,
		end: number,
	): TextDecoration | PluginAPI['mixed']
	setRangeTextDecoration(
		start: number,
		end: number,
		value: TextDecoration,
	): void
	getRangeLetterSpacing(
		start: number,
		end: number,
	): LetterSpacing | PluginAPI['mixed']
	setRangeLetterSpacing(start: number, end: number, value: LetterSpacing): void
	getRangeLineHeight(
		start: number,
		end: number,
	): LineHeight | PluginAPI['mixed']
	setRangeLineHeight(start: number, end: number, value: LineHeight): void
	getRangeFills(start: number, end: number): SPaint[] | PluginAPI['mixed']
	setRangeFills(start: number, end: number, value: SPaint[]): void
	getRangeTextStyleId(start: number, end: number): string | PluginAPI['mixed']
	setRangeTextStyleId(start: number, end: number, value: string): void
	getRangeFillStyleId(start: number, end: number): string | PluginAPI['mixed']
	setRangeFillStyleId(start: number, end: number, value: string): void
}

interface ComponentSetNode extends SBaseFrameMixin, PublishableMixin {
	readonly type: 'COMPONENT_SET'
	clone(): ComponentSetNode
	readonly defaultVariant: SComponentNode
}

export interface SComponentNode extends SDefaultFrameMixin, PublishableMixin {
	readonly type: 'COMPONENT'
	// clone(): SComponentNode
	// createInstance(): SInstanceNode
}

export interface SInstanceNode extends SDefaultFrameMixin {
	readonly type: 'INSTANCE'
	// clone(): SInstanceNode
	mainComponent: SComponentNode | null
	// swapComponent(componentNode: ComponentNode): void
	// detachInstance(): FrameNode
	// scaleFactor: number
}

interface BooleanOperationNode
	extends DefaultShapeMixin,
		SChildrenMixin,
		SCornerMixin {
	readonly type: 'BOOLEAN_OPERATION'
	clone(): BooleanOperationNode
	booleanOperation: 'UNION' | 'INTERSECT' | 'SUBTRACT' | 'EXCLUDE'

	expanded: boolean
}

export type SBaseNode = SDocumentNode | SPageNode | SSceneNode

export type SSceneNode =
	| SliceNode
	| FrameNode
	| GroupNode
	| ComponentSetNode
	| SComponentNode
	| SInstanceNode
	| BooleanOperationNode
	| VectorNode
	| StarNode
	| LineNode
	| EllipseNode
	| PolygonNode
	| RectangleNode
	| TextNode

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
	readonly id: string
	readonly type: StyleType
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
	readonly hash: string
	getBytesAsync(): Promise<Uint8Array>
}
