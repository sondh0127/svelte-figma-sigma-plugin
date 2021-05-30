'use strict';

// https://github.com/dtao/nearest-color converted to ESM and Typescript
// It was sligtly modified to support Typescript better.
// It was also slighly simplified because many parts weren't being used.
/**
 * Defines an available color.
 *
 * @typedef {Object} ColorSpec
 * @property {string=} name A name for the color, e.g., 'red'
 * @property {string} source The hex-based color string, e.g., '#FF0'
 * @property {RGB} rgb The {@link RGB} color values
 */
/**
 * Describes a matched color.
 *
 * @typedef {Object} ColorMatch
 * @property {string} name The name of the matched color, e.g., 'red'
 * @property {string} value The hex-based color string, e.g., '#FF0'
 * @property {RGB} rgb The {@link RGB} color values.
 */
/**
 * Provides the RGB breakdown of a color.
 *
 * @typedef {Object} RGB
 * @property {number} r The red component, from 0 to 255
 * @property {number} g The green component, from 0 to 255
 * @property {number} b The blue component, from 0 to 255
 */
/**
 * Gets the nearest color, from the given list of {@link ColorSpec} objects
 * (which defaults to {@link nearestColor.DEFAULT_COLORS}).
 *
 * Probably you wouldn't call this method directly. Instead you'd get a custom
 * color matcher by calling {@link nearestColor.from}.
 *
 * @public
 * @param {RGB|string} needle Either an {@link RGB} color or a hex-based
 *     string representing one, e.g., '#FF0'
 * @param {Array.<ColorSpec>=} colors An optional list of available colors
 *     (defaults to {@link nearestColor.DEFAULT_COLORS})
 * @return {ColorMatch|string} If the colors in the provided list had names,
 *     then a {@link ColorMatch} object with the name and (hex) value of the
 *     nearest color from the list. Otherwise, simply the hex value.
 *
 * @example
 * nearestColor({ r: 200, g: 50, b: 50 }); // => '#f00'
 * nearestColor('#f11');                   // => '#f00'
 * nearestColor('#f88');                   // => '#f80'
 * nearestColor('#ffe');                   // => '#ff0'
 * nearestColor('#efe');                   // => '#ff0'
 * nearestColor('#abc');                   // => '#808'
 * nearestColor('red');                    // => '#f00'
 * nearestColor('foo');                    // => throws
 */
function nearestColor(needle, colors) {
    needle = parseColor(needle);
    let distanceSq, minDistanceSq = Infinity, rgb, value;
    for (let i = 0; i < colors.length; ++i) {
        rgb = colors[i].rgb;
        distanceSq =
            Math.pow(needle.r - rgb.r, 2) +
                Math.pow(needle.g - rgb.g, 2) +
                Math.pow(needle.b - rgb.b, 2);
        if (distanceSq < minDistanceSq) {
            minDistanceSq = distanceSq;
            value = colors[i];
        }
    }
    // @ts-ignore this is always not null
    return value.source;
}
/**
 * Given either an array or object of colors, returns an array of
 * {@link ColorSpec} objects (with {@link RGB} values).
 *
 * @private
 * @param {Array.<string>|Object} colors An array of hex-based color strings, or
 *     an object mapping color *names* to hex values.
 * @return {Array.<ColorSpec>} An array of {@link ColorSpec} objects
 *     representing the same colors passed in.
 */
function mapColors(colors) {
    return colors.map((color) => createColorSpec(color));
}
/**
 * Provides a matcher to find the nearest color based on the provided list of
 * available colors.
 *
 * @public
 * @param {Array.<string>|Object} availableColors An array of hex-based color
 *     strings, or an object mapping color *names* to hex values.
 * @return {function(string):ColorMatch|string} A function with the same
 *     behavior as {@link nearestColor}, but with the list of colors
 *     predefined.
 *
 * @example
 * var colors = {
 *   'maroon': '#800',
 *   'light yellow': { r: 255, g: 255, b: 51 },
 *   'pale blue': '#def',
 *   'white': 'fff'
 * };
 *
 * var bgColors = [
 *   '#eee',
 *   '#444'
 * ];
 *
 * var invalidColors = {
 *   'invalid': 'foo'
 * };
 *
 * var getColor = nearestColor.from(colors);
 * var getBGColor = getColor.from(bgColors);
 * var getAnyColor = nearestColor.from(colors).or(bgColors);
 *
 * getColor('ffe');
 * // => { name: 'white', value: 'fff', rgb: { r: 255, g: 255, b: 255 }, distance: 17}
 *
 * getColor('#f00');
 * // => { name: 'maroon', value: '#800', rgb: { r: 136, g: 0, b: 0 }, distance: 119}
 *
 * getColor('#ff0');
 * // => { name: 'light yellow', value: '#ffff33', rgb: { r: 255, g: 255, b: 51 }, distance: 51}
 *
 * getBGColor('#fff'); // => '#eee'
 * getBGColor('#000'); // => '#444'
 *
 * getAnyColor('#f00');
 * // => { name: 'maroon', value: '#800', rgb: { r: 136, g: 0, b: 0 }, distance: 119}
 *
 * getAnyColor('#888'); // => '#444'
 *
 * nearestColor.from(invalidColors); // => throws
 */
const nearestColorFrom = (availableColors) => {
    const colors = mapColors(availableColors);
    return (hex) => nearestColor(hex, colors);
};
/**
 * Parses a color from a string.
 *
 * @private
 * @param {RGB|string} source
 * @return {RGB}
 *
 * @example
 * parseColor({ r: 3, g: 22, b: 111 }); // => { r: 3, g: 22, b: 111 }
 * parseColor('#f00');                  // => { r: 255, g: 0, b: 0 }
 * parseColor('#04fbc8');               // => { r: 4, g: 251, b: 200 }
 * parseColor('#FF0');                  // => { r: 255, g: 255, b: 0 }
 * parseColor('rgb(3, 10, 100)');       // => { r: 3, g: 10, b: 100 }
 * parseColor('rgb(50%, 0%, 50%)');     // => { r: 128, g: 0, b: 128 }
 * parseColor('aqua');                  // => { r: 0, g: 255, b: 255 }
 * parseColor('fff');                   // => { r: 255, g: 255, b: 255 }
 * parseColor('foo');                   // => throws
 */
function parseColor(source) {
    let red, green, blue;
    if (typeof source === 'object') {
        return source;
    }
    let hexMatchArr = source.match(/^#?((?:[0-9a-f]{3}){1,2})$/i);
    if (hexMatchArr) {
        const hexMatch = hexMatchArr[1];
        if (hexMatch.length === 3) {
            hexMatchArr = [
                hexMatch.charAt(0) + hexMatch.charAt(0),
                hexMatch.charAt(1) + hexMatch.charAt(1),
                hexMatch.charAt(2) + hexMatch.charAt(2),
            ];
        }
        else {
            hexMatchArr = [
                hexMatch.substring(0, 2),
                hexMatch.substring(2, 4),
                hexMatch.substring(4, 6),
            ];
        }
        red = parseInt(hexMatchArr[0], 16);
        green = parseInt(hexMatchArr[1], 16);
        blue = parseInt(hexMatchArr[2], 16);
        return { r: red, g: green, b: blue };
    }
    throw Error('"' + source + '" is not a valid color');
}
//   export function createColorSpec(input: string | RGB, name: string): ColorSpec;
//   // it can actually return a ColorMatch, but let's ignore that for simplicity
//   // in this app, it is never going to return ColorMatch because the input is hex instead of red
//   export function from(
//     availableColors: Array<String> | Object
//   ): (attr: string) => string;
/**
 * Creates a {@link ColorSpec} from either a string or an {@link RGB}.
 *
 * @private
 * @param {string|RGB} input
 * @param {string=} name
 * @return {ColorSpec}
 *
 * @example
 * createColorSpec('#800'); // => {
 *   source: '#800',
 *   rgb: { r: 136, g: 0, b: 0 }
 * }
 *
 * createColorSpec('#800', 'maroon'); // => {
 *   name: 'maroon',
 *   source: '#800',
 *   rgb: { r: 136, g: 0, b: 0 }
 * }
 */
function createColorSpec(input) {
    return {
        source: input,
        rgb: parseColor(input),
    };
}

// Basic Tailwind Colors
const tailwindColors = {
    '#000000': 'black',
    '#ffffff': 'white',
    '#fdf2f8': 'pink-50',
    '#fce7f3': 'pink-100',
    '#fbcfe8': 'pink-200',
    '#f9a8d4': 'pink-300',
    '#f472b6': 'pink-400',
    '#ec4899': 'pink-500',
    '#db2777': 'pink-600',
    '#be185d': 'pink-700',
    '#9d174d': 'pink-800',
    '#831843': 'pink-900',
    '#f5f3ff': 'purple-50',
    '#ede9fe': 'purple-100',
    '#ddd6fe': 'purple-200',
    '#c4b5fd': 'purple-300',
    '#a78bfa': 'purple-400',
    '#8b5cf6': 'purple-500',
    '#7c3aed': 'purple-600',
    '#6d28d9': 'purple-700',
    '#5b21b6': 'purple-800',
    '#4c1d95': 'purple-900',
    '#eef2ff': 'indigo-50',
    '#e0e7ff': 'indigo-100',
    '#c7d2fe': 'indigo-200',
    '#a5b4fc': 'indigo-300',
    '#818cf8': 'indigo-400',
    '#6366f1': 'indigo-500',
    '#4f46e5': 'indigo-600',
    '#4338ca': 'indigo-700',
    '#3730a3': 'indigo-800',
    '#312e81': 'indigo-900',
    '#eff6ff': 'blue-50',
    '#dbeafe': 'blue-100',
    '#bfdbfe': 'blue-200',
    '#93c5fd': 'blue-300',
    '#60a5fa': 'blue-400',
    '#3b82f6': 'blue-500',
    '#2563eb': 'blue-600',
    '#1d4ed8': 'blue-700',
    '#1e40af': 'blue-800',
    '#1e3a8a': 'blue-900',
    '#ecfdf5': 'green-50',
    '#d1fae5': 'green-100',
    '#a7f3d0': 'green-200',
    '#6ee7b7': 'green-300',
    '#34d399': 'green-400',
    '#10b981': 'green-500',
    '#059669': 'green-600',
    '#047857': 'green-700',
    '#065f46': 'green-800',
    '#064e3b': 'green-900',
    '#fffbeb': 'yellow-50',
    '#fef3c7': 'yellow-100',
    '#fde68a': 'yellow-200',
    '#fcd34d': 'yellow-300',
    '#fbbf24': 'yellow-400',
    '#f59e0b': 'yellow-500',
    '#d97706': 'yellow-600',
    '#b45309': 'yellow-700',
    '#92400e': 'yellow-800',
    '#78350f': 'yellow-900',
    '#fef2f2': 'red-50',
    '#fee2e2': 'red-100',
    '#fecaca': 'red-200',
    '#fca5a5': 'red-300',
    '#f87171': 'red-400',
    '#ef4444': 'red-500',
    '#dc2626': 'red-600',
    '#b91c1c': 'red-700',
    '#991b1b': 'red-800',
    '#7f1d1d': 'red-900',
    '#f9fafb': 'gray-50',
    '#f3f4f6': 'gray-100',
    '#e5e7eb': 'gray-200',
    '#d1d5db': 'gray-300',
    '#9ca3af': 'gray-400',
    '#6b7280': 'gray-500',
    '#4b5563': 'gray-600',
    '#374151': 'gray-700',
    '#1f2937': 'gray-800',
    '#111827': 'gray-900',
};
nearestColorFrom(Object.keys(tailwindColors));

// this is necessary to avoid a height of 4.999999523162842.
const numToAutoFixed = (num) => {
    return num.toFixed(2).replace(/\.00$/, '');
};

function notEmpty(value) {
    return value !== null && value !== undefined;
}
const applyMatrixToPoint = (matrix, point) => {
    return [
        point[0] * matrix[0][0] + point[1] * matrix[0][1] + matrix[0][2],
        point[0] * matrix[1][0] + point[1] * matrix[1][1] + matrix[1][2],
    ];
};
/**
 *  this function return a bounding rect for an nodes
 */
// x/y absolute coordinates
// height/width
// x2/y2 bottom right coordinates
const getBoundingRect = (node) => {
    const halfHeight = node.height / 2;
    const halfWidth = node.width / 2;
    const [[c0, s0, x], [s1, c1, y]] = node.absoluteTransform;
    const matrix = [
        [c0, s0, x + halfWidth * c0 + halfHeight * s0],
        [s1, c1, y + halfWidth * s1 + halfHeight * c1],
    ];
    // the coordinates of the corners of the rectangle
    const XY = {
        x: [1, -1, 1, -1],
        y: [1, -1, -1, 1],
    };
    // fill in
    for (let i = 0; i <= 3; i++) {
        const a = applyMatrixToPoint(matrix, [
            XY.x[i] * halfWidth,
            XY.y[i] * halfHeight,
        ]);
        XY.x[i] = a[0];
        XY.y[i] = a[1];
    }
    XY.x.sort((a, b) => a - b);
    XY.y.sort((a, b) => a - b);
    return {
        x: XY.x[0],
        y: XY.y[0],
    };
};
// https://stackoverflow.com/a/20762713
const mostFrequent = (arr) => {
    return arr
        .sort((a, b) => arr.filter((v) => v === a).length - arr.filter((v) => v === b).length)
        .pop();
};
function toFixed(number, precision) {
    const multiplier = Math.pow(10, precision + 1);
    const wholeNumber = Math.floor(number * multiplier);
    return (Math.round(wholeNumber / 10) * 10) / multiplier;
}
function createRemFromPx(px) {
    const pixels = parseFloat(px);
    if (pixels <= 1)
        return px;
    return toFixed((pixels / 1920) * 120, 3);
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

/**
 * Source: ftp://ftp.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt
 */
/**
 * Lower case as a function.
 */
function lowerCase(str) {
    return str.toLowerCase();
}

// Support camel case ("camelCase" -> "camel Case" and "CAMELCase" -> "CAMEL Case").
var DEFAULT_SPLIT_REGEXP = [/([a-z0-9])([A-Z])/g, /([A-Z])([A-Z][a-z])/g];
// Remove all non-word characters.
var DEFAULT_STRIP_REGEXP = /[^A-Z0-9]+/gi;
/**
 * Normalize the string into something other libraries can manipulate easier.
 */
function noCase(input, options) {
    if (options === void 0) { options = {}; }
    var _a = options.splitRegexp, splitRegexp = _a === void 0 ? DEFAULT_SPLIT_REGEXP : _a, _b = options.stripRegexp, stripRegexp = _b === void 0 ? DEFAULT_STRIP_REGEXP : _b, _c = options.transform, transform = _c === void 0 ? lowerCase : _c, _d = options.delimiter, delimiter = _d === void 0 ? " " : _d;
    var result = replace(replace(input, splitRegexp, "$1\0$2"), stripRegexp, "\0");
    var start = 0;
    var end = result.length;
    // Trim the delimiter from around the output string.
    while (result.charAt(start) === "\0")
        start++;
    while (result.charAt(end - 1) === "\0")
        end--;
    // Transform each token independently.
    return result.slice(start, end).split("\0").map(transform).join(delimiter);
}
/**
 * Replace `re` in the input string with the replacement value.
 */
function replace(input, re, value) {
    if (re instanceof RegExp)
        return input.replace(re, value);
    return re.reduce(function (input, re) { return input.replace(re, value); }, input);
}

function dotCase(input, options) {
    if (options === void 0) { options = {}; }
    return noCase(input, __assign({ delimiter: "." }, options));
}

function paramCase(input, options) {
    if (options === void 0) { options = {}; }
    return dotCase(input, __assign({ delimiter: "-" }, options));
}

const sScene = (node) => {
    const clazz = [];
    if (node.visible !== undefined && !node.visible) {
        clazz.push('invisible');
    }
    return { clazz };
};
const sBlend = (node) => {
    const clazz = [];
    const style = [];
    // [when testing] node.opacity can be undefined
    if (node.opacity !== undefined && node.opacity !== 1) {
        clazz.push(`opacity-[${node.opacity}]`);
    }
    if (node.blendMode !== 'PASS_THROUGH') {
        clazz.push(`mix-blend-${paramCase(node.blendMode)}`);
    }
    if (node.effects && node.effects.length > 0) {
        console.log('🇻🇳 ~ file: tailwindConversion.ts ~ line 36 ~ node.effects', node.effects);
        node.effects.forEach((effect) => {
            const getShadow = (effect) => {
                const x = createRemFromPx(effect.offset.x);
                const y = createRemFromPx(effect.offset.y);
                const blur = createRemFromPx(effect.radius);
                const spread = createRemFromPx(effect.spread);
                const getColorValue = (value) => {
                    return Math.round(value * 255);
                };
                const r = getColorValue(effect.color.r);
                const g = getColorValue(effect.color.g);
                const b = getColorValue(effect.color.b);
                const a = toFixed(effect.color.a, 2);
                return `${x}rem ${y}rem ${blur}rem ${spread}rem rgba(${r}, ${g}, ${b}, ${a})`;
            };
            if (effect.visible) {
                switch (effect.type) {
                    case 'DROP_SHADOW':
                        style.push(`box-shadow: ${getShadow(effect)}`);
                        break;
                    case 'INNER_SHADOW':
                        style.push(`box-shadow: inset ${getShadow(effect)}`);
                        break;
                }
            }
        });
    }
    return { clazz, style };
    // return [
    // 'isMask',
    // 'effectStyleId',
    // ]
};
const sLayout = (node) => {
    console.log('🇻🇳 ~ file: tailwindConversion.ts ~ line 92 ~ node', node);
    const clazz = [];
    const style = [];
    if (node.rotation !== undefined && Math.round(node.rotation) !== 0) {
        const rotation = -Math.round(node.rotation);
        clazz.push(`transform rotate-[${rotation}deg]`);
    }
    // TODO: check isRelative inside convertToAutoLayout
    if (node.width && node.height) {
        style.push(`w-[${numToAutoFixed(node.width)}px]`);
        style.push(`h-[${numToAutoFixed(node.height)}px]`);
    }
    return { clazz, style };
    // return [
    // 	'absoluteTransform',
    // 	'relativeTransform',
    // 	'x',
    // 	'y',
    // 	'constrainProportions',
    // 	'layoutAlign',
    // 	'layoutGrow',
    // ]
};
function tailwindSRectangle(node, children) {
    const clazz = [
        ...sBlend(node).clazz,
        ...sScene(node).clazz,
        ...sLayout(node).clazz,
    ].join(' ');
    const style = [...sBlend(node).style].join('; ');
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
    return { clazz, style };
}

let scriptSet = new Set();
const tailwindMain = (sceneNode, parentIdSrc = '', layerName = false) => {
    scriptSet = new Set();
    let result = tailwindWidgetGenerator(sceneNode);
    console.log('🇻🇳 ~ file: tailwindMain.ts ~ line 37 ~ result', result);
    // remove the initial \n that is made in Container.
    if (result.length > 0 && result.slice(0, 1) === '\n') {
        result = result.slice(1, result.length);
    }
    const scripts = [`<script>`];
    if (scriptSet.has('Button')) {
        scripts.push(`import { Button } from '@/serverMiddleware/src/lib/Prediction'`);
    }
    if (scriptSet.has('focusSection')) {
        scripts.push(`import { focusSection, focusable } from '@/serverMiddleware/src/actions/spatial-navigation'`);
    }
    {
        scripts.push(`import Keypad from '@/serverMiddleware/src/components/Keypad.svelte'`);
        scripts.push(`const handleSubmit = () => {}`);
        scripts.push(`const maxLength = 4`);
    }
    scripts.push(`</script>\n\n`);
    return scripts.join('\n') + result;
};
// todo lint idea: replace BorderRadius.only(topleft: 8, topRight: 8) with BorderRadius.horizontal(8)
const tailwindWidgetGenerator = (sceneNode) => {
    let comp = '';
    // filter non visible nodes. This is necessary at this step because conversion already happened.
    const visibleSceneNode = sceneNode.filter((d) => d.visible !== false);
    visibleSceneNode.forEach((node) => {
        switch (node.type) {
            case 'RECTANGLE':
                // ignore the view when size is zero or less
                // while technically it shouldn't get less than 0, due to rounding errors,
                // it can get to values like: -0.000004196293048153166
                if (node.width <= 0 || node.height <= 0) {
                    comp += '';
                }
                else {
                    const tag = 'div';
                    const { clazz, style } = tailwindSRectangle(node);
                    comp += `<${tag} class="${clazz}" style="${style}"></${tag}>`;
                }
                break;
        }
        // if (node.type === 'RECTANGLE' || node.type === 'ELLIPSE') {
        // 	comp += tailwindContainer(node, '', '', {
        // 		isRelative: false,
        // 		isInput: false,
        // 	})
        // } else if (node.type === 'GROUP') {
        // 	comp += tailwindGroup(node)
        // } else if (node.type === 'FRAME') {
        // } else if (node.type === 'TEXT') {
        // 	comp += tailwindText(node, false)
        // } else if (node.type === 'COMPONENT') {
        // 	comp += tailwindComponent(node)
        // } else if (node.type === 'INSTANCE') {
        // 	comp += tailwindInstance(node)
        // }
        // todo support Line
    });
    return comp;
};

const convertGroupToFrame = (node) => {
    const newNode = {
        type: 'FRAME',
    };
    newNode.id = node.id;
    newNode.name = node.name;
    newNode.x = node.x;
    newNode.y = node.y;
    newNode.width = node.width;
    newNode.height = node.height;
    newNode.rotation = node.rotation;
    newNode.fills = [];
    newNode.strokes = [];
    newNode.effects = [];
    newNode.cornerRadius = 0;
    newNode.layoutMode = 'NONE';
    newNode.counterAxisSizingMode = 'AUTO';
    newNode.primaryAxisSizingMode = 'AUTO';
    newNode.primaryAxisAlignItems = 'CENTER';
    newNode.primaryAxisAlignItems = 'CENTER';
    newNode.clipsContent = false;
    newNode.layoutGrids = [];
    newNode.gridStyleId = '';
    newNode.guides = [];
    newNode.parent = node.parent;
    // update the children's x and y position. Modify the 'original' node, then pass them.
    updateChildrenXY(node);
    newNode.children = node.children;
    newNode.children.forEach((d) => {
        // update the parent of each child
        d.parent = newNode;
    });
    // don't need to take care of newNode.parent.children because method is recursive.
    // .children =... calls convertGroupToFrame() which returns the correct node
    return newNode;
};
/**
 * Update all children's X and Y value from a Group.
 * Group uses relative values, while Frame use absolute. So child.x - group.x = child.x on Frames.
 * This isn't recursive, because it is going to run from the inner-most to outer-most element. Therefore, it would calculate wrongly otherwise.
 *
 * This must be called with a GroupNode. Param accepts anything because of the recurison.
 * Result of a Group with x,y = (250, 250) and child at (260, 260) must be child at (10, 10)
 */
const updateChildrenXY = (node) => {
    // the second condition is necessary, so it can convert the root
    if (node.type === 'GROUP') {
        node.children.forEach((d) => {
            d.x = d.x - node.x;
            d.y = d.y - node.y;
            updateChildrenXY(d);
        });
        return node;
    }
    else {
        return node;
    }
};

/**
 * Add AutoLayout attributes if layout has items aligned (either vertically or horizontally).
 * To make the calculation, the average position of every child, ordered, needs to pass a threshold.
 * If it fails for both X and Y axis, there is no AutoLayout and return it unchanged.
 * If it finds, add the correct attributes. When original node is a Group,
 * convert it to Frame before adding the attributes. Group doesn't have AutoLayout properties.
 */
const convertToAutoLayout = (node) => {
    // only go inside when AutoLayout is not already set.
    if (('layoutMode' in node &&
        node.layoutMode === 'NONE' &&
        node.children.length > 0) ||
        node.type === 'GROUP') {
        const [orderedChildren, direction, itemSpacing] = reorderChildrenIfAligned(node.children);
        node.children = orderedChildren;
        if (direction === 'NONE' && node.children.length > 1) {
            node.isRelative = true;
        }
        if (direction === 'NONE' && node.children.length !== 1) {
            // catches when children is 0 or children is larger than 1
            return node;
        }
        // if node is a group, convert to frame
        if (node.type === 'GROUP') {
            node = convertGroupToFrame(node);
        }
        if (direction === 'NONE' && node.children.length === 1) {
            // Add fake AutoLayout when there is a single item. This is done for the Padding.
            node.layoutMode = 'HORIZONTAL';
        }
        else {
            node.layoutMode = direction;
        }
        node.itemSpacing = itemSpacing > 0 ? itemSpacing : 0;
        const padding = detectAutoLayoutPadding(node);
        node.paddingTop = Math.max(padding.top, 0);
        node.paddingBottom = Math.max(padding.bottom, 0);
        node.paddingLeft = Math.max(padding.left, 0);
        node.paddingRight = Math.max(padding.right, 0);
        // set children to INHERIT or STRETCH
        node.children.map((d) => {
            // @ts-ignore current node can't be SGroupNode because it was converted into SFrameNode
            layoutAlignInChild(d, node);
        });
        const allChildrenDirection = node.children.map((d) => 
        // @ts-ignore current node can't be SGroupNode because it was converted into SFrameNode
        primaryAxisDirection(d, node));
        const primaryDirection = allChildrenDirection.map((d) => d.primary);
        const counterDirection = allChildrenDirection.map((d) => d.counter);
        // @ts-ignore it is never going to be undefined.
        node.primaryAxisAlignItems = mostFrequent(primaryDirection);
        // @ts-ignore it is never going to be undefined.
        node.counterAxisAlignItems = mostFrequent(counterDirection);
        node.counterAxisSizingMode = 'FIXED';
        node.primaryAxisSizingMode = 'FIXED';
    }
    return node;
};
/**
 * Standard average calculation. Length must be > 0
 */
const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;
/**
 * Check the average of children positions against this threshold;
 * This allows a small tolerance, which is useful when items are slightly overlayed.
 * If you set this lower, layouts will get more responsive but with less visual fidelity.
 */
const threshold = -2;
/**
 * Verify if children are sorted by their relative position and return them sorted, if identified.
 */
const reorderChildrenIfAligned = (children) => {
    if (children.length === 1) {
        return [[...children], 'NONE', 0];
    }
    const updateChildren = [...children];
    const [visit, avg] = shouldVisit(updateChildren);
    // check against a threshold
    if (visit === 'VERTICAL') {
        // if all elements are horizontally aligned
        return [updateChildren.sort((a, b) => a.y - b.y), 'VERTICAL', avg];
    }
    else {
        if (visit === 'HORIZONTAL') {
            // if all elements are vertically aligned
            return [updateChildren.sort((a, b) => a.x - b.x), 'HORIZONTAL', avg];
        }
    }
    return [updateChildren, 'NONE', 0];
};
/**
 * Checks if layout is horizontally or vertically aligned.
 * First verify if all items are vertically aligned in Y axis (spacing > 0), then for X axis, then the average for Y and finally the average for X.
 * If no correspondence is found, returns "NONE".
 * In a previous version, it used a "standard deviation", but "average" performed better.
 */
const shouldVisit = (children) => {
    const intervalY = calculateInterval(children, 'y');
    const intervalX = calculateInterval(children, 'x');
    const avgX = average(intervalX);
    const avgY = average(intervalY);
    if (!intervalY.every((d) => d >= threshold)) {
        if (!intervalX.every((d) => d >= threshold)) {
            if (avgY <= threshold) {
                if (avgX <= threshold) {
                    return ['NONE', 0];
                }
                return ['HORIZONTAL', avgX];
            }
            return ['VERTICAL', avgY];
        }
        return ['HORIZONTAL', avgX];
    }
    return ['VERTICAL', avgY];
};
// todo improve this method to try harder. Idea: maybe use k-means or hierarchical cluster?
/**
 * This function calculates the distance (interval) between items.
 * Example: for [item]--8--[item]--8--[item], the result is [8, 8]
 */
const calculateInterval = (children, xOrY) => {
    const hOrW = xOrY === 'x' ? 'width' : 'height';
    // sort children based on X or Y values
    const sorted = [...children].sort((a, b) => a[xOrY] - b[xOrY]);
    // calculate the distance between values (either vertically or horizontally)
    const interval = [];
    for (let i = 0; i < sorted.length - 1; i++) {
        interval.push(sorted[i + 1][xOrY] - (sorted[i][xOrY] + sorted[i][hOrW]));
    }
    return interval;
};
/**
 * Calculate the Padding.
 * This is very verbose, but also more performant than calculating them independently.
 */
const detectAutoLayoutPadding = (node) => {
    // this need to be run before VERTICAL or HORIZONTAL
    if (node.children.length === 1) {
        // left padding is first element's y value
        const left = node.children[0].x;
        const right = node.width - (node.children[0].x + node.children[0].width);
        const top = node.children[0].y;
        const bottom = node.height - (node.children[0].y + node.children[0].height);
        // return the smallest padding in each axis
        return {
            left: left,
            right: right,
            top: top,
            bottom: bottom,
        };
    }
    else if (node.layoutMode === 'VERTICAL') {
        // top padding is first element's y value
        const top = node.children[0].y;
        // bottom padding is node height - last position + last height
        const last = node.children[node.children.length - 1];
        const bottom = node.height - (last.y + last.height);
        // the closest value to the left border
        const left = Math.min(...node.children.map((d) => d.x));
        // similar to [bottom] calculation, but using height and getting the minimum
        const right = Math.min(...node.children.map((d) => node.width - (d.width + d.x)));
        // return the smallest padding in each axis
        return {
            left: left,
            right: right,
            top: top,
            bottom: bottom,
        };
    }
    else {
        // node.layoutMode === "HORIZONTAL"
        // left padding is first element's y value
        const left = node.children[0].x;
        // right padding is node width - last position + last width
        const last = node.children[node.children.length - 1];
        const right = node.width - (last.x + last.width);
        // the closest value to the top border
        const top = Math.min(...node.children.map((d) => d.y));
        // similar to [right] calculation, but using height and getting the minimum
        const bottom = Math.min(...node.children.map((d) => node.height - (d.height + d.y)));
        // return the smallest padding in each axis
        return {
            left: left,
            right: right,
            top: top,
            bottom: bottom,
        };
    }
};
/**
 * Detect if children stretch or inherit.
 */
const layoutAlignInChild = (node, parentNode) => {
    const sameWidth = node.width - 2 >
        parentNode.width - parentNode.paddingLeft - parentNode.paddingRight;
    const sameHeight = node.height - 2 >
        parentNode.height - parentNode.paddingTop - parentNode.paddingBottom;
    if (parentNode.layoutMode === 'VERTICAL') {
        node.layoutAlign = sameWidth ? 'STRETCH' : 'INHERIT';
    }
    else {
        node.layoutAlign = sameHeight ? 'STRETCH' : 'INHERIT';
    }
    // with custom AutoLayout, this is never going to be 1.
    node.layoutGrow = 0;
};
const primaryAxisDirection = (node, parentNode) => {
    // parentNode.layoutMode can't be NONE.
    const nodeCenteredPosX = node.x + node.width / 2;
    const parentCenteredPosX = parentNode.width / 2;
    const centerXPosition = nodeCenteredPosX - parentCenteredPosX;
    const nodeCenteredPosY = node.y + node.height / 2;
    const parentCenteredPosY = parentNode.height / 2;
    const centerYPosition = nodeCenteredPosY - parentCenteredPosY;
    if (parentNode.layoutMode === 'VERTICAL') {
        return {
            primary: getPaddingDirection(centerYPosition),
            counter: getPaddingDirection(centerXPosition),
        };
    }
    else {
        return {
            primary: getPaddingDirection(centerXPosition),
            counter: getPaddingDirection(centerYPosition),
        };
    }
};
const getPaddingDirection = (position) => {
    // allow a small threshold
    if (position < -4) {
        return 'MIN';
    }
    else if (position > 4) {
        return 'MAX';
    }
    else {
        return 'CENTER';
    }
};

/**
 * Identify all nodes that are inside Rectangles and transform those Rectangles into Frames containing those nodes.
 */
const convertNodesOnRectangle = (node) => {
    if (node.children.length < 2) {
        return node;
    }
    if (!node.id) {
        throw new Error('Node is missing an id! This error should only happen in tests.');
    }
    const colliding = retrieveCollidingItems(node.children);
    const parentsKeys = Object.keys(colliding);
    // start with all children. This is going to be filtered.
    let updatedChildren = [...node.children];
    parentsKeys.forEach((key) => {
        // dangerous cast, but this is always true
        const parentNode = node.children.find((d) => d.id === key);
        // retrieve the position. Key should always be at the left side, so even when other items are removed, the index is kept the same.
        const indexPosition = updatedChildren.findIndex((d) => d.id === key);
        // filter the children to remove those that are being modified
        updatedChildren = updatedChildren.filter((d) => !colliding[key].map((dd) => dd.id).includes(d.id) && key !== d.id);
        const frameNode = convertRectangleToFrame(parentNode);
        // todo when the soon-to-be-parent is larger than its parent, things get weird. Happens, for example, when a large image is used in the background. Should this be handled or is this something user should never do?
        frameNode.children = [...colliding[key]];
        colliding[key].forEach((d) => {
            d.parent = frameNode;
            d.x = d.x - frameNode.x;
            d.y = d.y - frameNode.y;
        });
        // try to convert the children to AutoLayout, and insert back at updatedChildren.
        updatedChildren.splice(indexPosition, 0, convertToAutoLayout(frameNode));
    });
    if (updatedChildren.length > 0) {
        node.children = updatedChildren;
    }
    // convert the resulting node to AutoLayout.
    node = convertToAutoLayout(node);
    return node;
};
const convertRectangleToFrame = (rect) => {
    // if a Rect with elements inside were identified, extract this Rect
    // outer methods are going to use it.
    const frameNode = {
        type: 'FRAME',
    };
    frameNode.parent = rect.parent;
    frameNode.width = rect.width;
    frameNode.height = rect.height;
    frameNode.x = rect.x;
    frameNode.y = rect.y;
    frameNode.rotation = rect.rotation;
    frameNode.layoutMode = 'NONE';
    // opacity should be ignored, else it will affect children
    // when invisible, add the layer but don't fill it; he designer might use invisible layers for alignment.
    // visible can be undefined in tests
    if (rect.visible !== false) {
        frameNode.fills = rect.fills;
        frameNode.fillStyleId = rect.fillStyleId;
        frameNode.strokes = rect.strokes;
        frameNode.strokeStyleId = rect.strokeStyleId;
        frameNode.effects = rect.effects;
        frameNode.effectStyleId = rect.effectStyleId;
    }
    // inner Rectangle shall get a FIXED size
    frameNode.counterAxisAlignItems = 'MIN';
    frameNode.counterAxisSizingMode = 'FIXED';
    frameNode.primaryAxisAlignItems = 'MIN';
    frameNode.primaryAxisSizingMode = 'FIXED';
    frameNode.strokeAlign = rect.strokeAlign;
    frameNode.strokeCap = rect.strokeCap;
    frameNode.strokeJoin = rect.strokeJoin;
    frameNode.strokeMiterLimit = rect.strokeMiterLimit;
    frameNode.strokeWeight = rect.strokeWeight;
    frameNode.cornerRadius = rect.cornerRadius;
    frameNode.cornerSmoothing = rect.cornerSmoothing;
    frameNode.topLeftRadius = rect.topLeftRadius;
    frameNode.topRightRadius = rect.topRightRadius;
    frameNode.bottomLeftRadius = rect.bottomLeftRadius;
    frameNode.bottomRightRadius = rect.bottomRightRadius;
    frameNode.id = rect.id;
    frameNode.name = rect.name;
    return frameNode;
};
/**
 * Iterate over each Rectangle and check if it has any child on top.
 * This is O(n^2), but is optimized to only do j=i+1 until length, and avoid repeated entries.
 * A Node can only have a single parent. The order is defined by layer order.
 */
const retrieveCollidingItems = (children) => {
    const used = {};
    const groups = {};
    for (let i = 0; i < children.length - 1; i++) {
        const item1 = children[i];
        // ignore items that are not Rectangles
        if (item1.type !== 'RECTANGLE') {
            continue;
        }
        for (let j = i + 1; j < children.length; j++) {
            const item2 = children[j];
            if (!used[item2.id] &&
                item1.x <= item2.x &&
                item1.y <= item2.y &&
                item1.x + item1.width >= item2.x + item2.width &&
                item1.y + item1.height >= item2.y + item2.height) {
                if (!groups[item1.id]) {
                    groups[item1.id] = [item2];
                }
                else {
                    groups[item1.id].push(item2);
                }
                used[item2.id] = true;
            }
        }
    }
    return groups;
};

/**
 * Returns the `x` and `y` position of the given `node` relative to the page.
 *
 * @category Node
 */
function getAbsolutePosition(node) {
    return {
        x: node.absoluteTransform[0][2],
        y: node.absoluteTransform[1][2]
    };
}

/**
 * Returns the parent node of the given `node`.
 *
 * @category Node
 */
function getParentNode(node) {
    const parentNode = node.parent;
    if (parentNode === null) {
        throw new Error(`\`node.parent\` is \`null\``);
    }
    return parentNode;
}

/**
 * Computes the coordinates (`x`, `y`) and dimensions (`width`, `height`) of
 * the smallest bounding box that contains the given `node`.
 *
 * @category Node
 */
function computeBoundingBox(node) {
    if (node.rotation === 0) {
        const absolutePosition = getAbsolutePosition(node);
        const { width, height } = node;
        return Object.assign(Object.assign({}, absolutePosition), { height, width });
    }
    const parentNode = getParentNode(node);
    const index = parentNode.children.indexOf(node);
    const group = figma.group([node], parentNode, index);
    const absolutePosition = getAbsolutePosition(group);
    const { width, height } = group;
    parentNode.insertChild(index, node);
    return Object.assign(Object.assign({}, absolutePosition), { height, width });
}

/**
 * Extracts the specified list of `attributes` from the given `array` of
 * plain objects.
 *
 * @returns Returns an array of plain objects.
 * @category Object
 */
function pick(object, keys) {
    const result = {};
    for (const key of keys) {
        const value = object[key];
        if (typeof value === 'undefined') {
            throw new Error(`Key \`${key}\` does not exist on \`object\``);
        }
        result[key] = value;
    }
    return result;
}

/**
 * Creates a deep copy of the given object.
 *
 * @category Object
 */
function cloneObject(object) {
    if (object === null ||
        typeof object === 'undefined' ||
        typeof object === 'boolean' ||
        typeof object === 'number' ||
        typeof object === 'string') {
        return object;
    }
    if (Array.isArray(object)) {
        const result = [];
        for (const value of object) {
            result.push(cloneObject(value));
        }
        return result;
    }
    const result = {};
    for (const key in object) {
        result[key] = cloneObject(object[key]);
    }
    return result;
}

const convertSLayout = (node) => {
    // Get the correct X/Y position when rotation is applied.
    // This won't guarantee a perfect position, since we would still
    // need to calculate the offset based on node width/height to compensate,
    // which we are not currently doing. However, this is a lot better than nothing and will help LineNode.
    const sLayoutNode = Object.assign({}, pick(node, [
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
    ]));
    if (node.rotation !== undefined && Math.round(node.rotation) !== 0) {
        const boundingRect = getBoundingRect(node);
        // TODO: place getBoundingRect with  computeBoundingBox
        computeBoundingBox(node);
        sLayoutNode.x = boundingRect.x;
        sLayoutNode.y = boundingRect.y;
    }
    return sLayoutNode;
};
const convertSGeometry = (node) => {
    const fills = cloneObject(node.fills);
    const strokes = cloneObject(node.strokes);
    const strokeCap = cloneObject(node.strokeCap);
    const strokeJoin = cloneObject(node.strokeJoin);
    const dashPattern = cloneObject(node.dashPattern);
    const fillStyleId = cloneObject(node.fillStyleId);
    return Object.assign(Object.assign({}, pick(node, [
        'strokeWeight',
        'strokeMiterLimit',
        'strokeAlign',
        'strokeStyleId',
    ])), { fills,
        strokes,
        strokeCap,
        strokeJoin,
        dashPattern,
        fillStyleId });
};
const convertSBlend = (node) => {
    return Object.assign({}, pick(node, [
        'opacity',
        'blendMode',
        'isMask',
        'effects',
        'effectStyleId',
    ]));
};
const convertSContainer = (node) => {
    return Object.assign({}, pick(node, ['expanded']));
};
const convertSCorner = (node) => {
    const cornerRadius = cloneObject(node.cornerRadius);
    const cornerSmoothing = cloneObject(node.cornerSmoothing);
    return {
        cornerRadius,
        cornerSmoothing,
    };
};
const convertSRectangleCorner = (node) => {
    return Object.assign({}, pick(node, [
        'topLeftRadius',
        'topRightRadius',
        'bottomLeftRadius',
        'bottomRightRadius',
    ]));
};
const convertSConstraint = (node) => {
    return Object.assign({}, pick(node, ['constraints']));
};
const convertSBase = (node) => {
    return Object.assign(Object.assign({}, pick(node, ['id', 'name'])), { parent: null });
};
const convertSBaseFrame = (node) => {
    const layoutGrids = cloneObject(node.layoutGrids);
    const guides = cloneObject(node.guides);
    const baseFrameNode = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, convertSScene(node)), convertSBase(node)), { children: [] }), convertSContainer(node)), convertSGeometry(node)), convertSRectangleCorner(node)), convertSCorner(node)), convertSBlend(node)), convertSConstraint(node)), convertSLayout(node)), convertSExport(node)), pick(node, [
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
    ])), { layoutGrids,
        guides });
    // Fix this: https://stackoverflow.com/questions/57859754/flexbox-space-between-but-center-if-one-element
    // It affects HTML, Tailwind, Flutter and possibly SwiftUI. So, let's be consistent.
    if (node.primaryAxisAlignItems === 'SPACE_BETWEEN' &&
        node.children.length === 1) {
        baseFrameNode.primaryAxisAlignItems = 'CENTER';
    }
    return baseFrameNode;
};
const convertSReaction = (node) => {
    const reactions = cloneObject(node.reactions);
    return {
        reactions,
    };
};
const convertSDefaultFrame = (node) => {
    cloneObject(node.reactions);
    return Object.assign(Object.assign(Object.assign({}, convertSBaseFrame(node)), pick(node, [
        'overflowDirection',
        'numberOfFixedChildren',
        'overlayPositionType',
        'overlayBackground',
        'overlayBackgroundInteraction',
    ])), convertSReaction(node));
};
const convertSScene = (node) => {
    return Object.assign({}, pick(node, ['locked', 'visible']));
};
const convertSExport = (node) => {
    const exportSettings = cloneObject(node.exportSettings);
    return {
        exportSettings,
    };
};
const convertSDefaultShape = (node) => {
    const reactions = cloneObject(node.reactions);
    return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, pick(node, [])), convertSBase(node)), convertSScene(node)), { reactions }), convertSBlend(node)), convertSGeometry(node)), convertSLayout(node)), convertSExport(node));
};
// Nodes Conversion
const convertIntoSComponent = (node) => {
    const documentationLinks = cloneObject(node.documentationLinks);
    return Object.assign(Object.assign(Object.assign({}, convertSDefaultFrame(node)), pick(node, ['type', 'remote', 'key', 'description'])), { documentationLinks });
};
const convertIntoSInstance = (node) => {
    let interactions = [];
    const includeComponents = ['Button'];
    const mainComponentName = node.mainComponent.name;
    if (includeComponents.includes(mainComponentName)) {
        try {
            interactions = JSON.parse(node.getPluginData('interactions'));
        }
        catch (error) {
            interactions = [];
        }
    }
    return Object.assign(Object.assign(Object.assign({}, convertSDefaultFrame(node)), pick(node, ['type'])), { interactions, mainComponent: convertIntoSComponent(node.mainComponent) });
};
const convertIntoSFrame = (node) => {
    let focusSection = {};
    try {
        focusSection = JSON.parse(node.getPluginData('focusSection'));
    }
    catch (error) {
        focusSection = {};
    }
    // convertToAutoLayout
    return Object.assign(Object.assign(Object.assign({}, convertSDefaultFrame(node)), pick(node, ['type'])), { focusSection });
};
const convertIntoSGroup = (node) => {
    // convertToAutoLayout
    return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, pick(node, ['type'])), convertSBase(node)), convertSScene(node)), convertSReaction(node)), { children: [] }), convertSContainer(node)), convertSBlend(node)), convertSLayout(node)), convertSExport(node));
};
const convertIntoSRectangle = (node) => {
    return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, pick(node, ['type'])), convertSDefaultShape(node)), convertSConstraint(node)), convertSCorner(node)), convertSRectangleCorner(node));
};
const convertIntoSEllipse = (node) => {
    return Object.assign(Object.assign(Object.assign(Object.assign({}, pick(node, ['type', 'arcData'])), convertSDefaultShape(node)), convertSConstraint(node)), convertSCorner(node));
};
const convertIntoSLine = (node) => {
    return Object.assign(Object.assign(Object.assign({}, pick(node, ['type'])), convertSDefaultShape(node)), convertSConstraint(node));
};
const convertIntoSVectorNode = (node) => {
    const vectorNetwork = cloneObject(node.vectorNetwork);
    const vectorPaths = cloneObject(node.vectorPaths);
    const handleMirroring = cloneObject(node.handleMirroring);
    return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, pick(node, ['type'])), convertSDefaultShape(node)), convertSConstraint(node)), convertSCorner(node)), { vectorNetwork,
        vectorPaths,
        handleMirroring });
};
const convertIntoSTextNode = (node) => {
    const textStyleId = cloneObject(node.textStyleId);
    const fontSize = cloneObject(node.fontSize);
    const fontName = cloneObject(node.fontName);
    const textCase = cloneObject(node.textCase);
    const letterSpacing = cloneObject(node.letterSpacing);
    const textDecoration = cloneObject(node.textDecoration);
    const lineHeight = cloneObject(node.lineHeight);
    return Object.assign(Object.assign(Object.assign(Object.assign({}, pick(node, [
        'type',
        'hasMissingFont',
        'textAlignHorizontal',
        'textAlignVertical',
        'textAutoResize',
        'paragraphIndent',
        'paragraphSpacing',
        'autoRename',
        'characters',
    ])), convertSDefaultShape(node)), convertSConstraint(node)), { textStyleId,
        fontSize,
        fontName,
        textCase,
        letterSpacing,
        textDecoration,
        lineHeight });
};

const convertIntoSingleSNode = (node, parent = null) => {
    return convertIntoSNodes([node], parent)[0];
};
const convertIntoSNodes = (sSceneNode, sParent = null) => {
    const mapped = sSceneNode.map((node) => {
        switch (node.type) {
            case 'RECTANGLE': {
                const sNode = convertIntoSRectangle(node);
                if (sParent) {
                    sNode.parent = sParent;
                }
                return sNode;
            }
            case 'ELLIPSE': {
                const sNode = convertIntoSEllipse(node);
                if (sParent) {
                    sNode.parent = sParent;
                }
                return sNode;
            }
            case 'LINE': {
                const sNode = convertIntoSLine(node);
                if (sParent) {
                    sNode.parent = sParent;
                }
                // Lines have a height of zero, but they must have a height, so add 1.
                sNode.height = 1;
                // Let them be CENTER, since on Lines this property is ignored.
                sNode.strokeAlign = 'CENTER';
                // Remove 1 since it now has a height of 1. It won't be visually perfect, but will be almost.
                sNode.strokeWeight = sNode.strokeWeight - 1;
                return sNode;
            }
            case 'VECTOR': {
                const sNode = convertIntoSVectorNode(node);
                if (sParent) {
                    sNode.parent = sParent;
                }
                // Vector support is still missing. Meanwhile, add placeholder.
                sNode.cornerRadius = 8;
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
                    ];
                }
                return sNode;
            }
            case 'TEXT': {
                const sNode = convertIntoSTextNode(node);
                if (sParent) {
                    sNode.parent = sParent;
                }
                return sNode;
            }
            case 'COMPONENT': {
                const sNode = convertIntoSComponent(node);
                if (sParent) {
                    sNode.parent = sParent;
                }
                if (sParent) {
                    sNode.parent = sParent;
                }
                sNode.children = convertIntoSNodes(node.children, sNode);
                return sNode;
            }
            case 'GROUP': {
                if (node.children.length === 1 && node.visible !== false) {
                    // if Group is visible and has only one child, Group should disappear.
                    // there will be a single value anyway.
                    return convertIntoSNodes(node.children, sParent)[0];
                }
                // const iconToRect = iconToRectangle(node, sParent)
                // if (iconToRect != null) {
                // 	return iconToRect
                // }
                const sNode = convertIntoSGroup(node);
                if (sParent) {
                    sNode.parent = sParent;
                }
                sNode.children = convertIntoSNodes(node.children, sNode);
                // try to find big rect and regardless of that result, also try to convert to autolayout.
                // There is a big chance this will be returned as a Frame
                // also, Group will always have at least 2 children.
                return convertNodesOnRectangle(sNode);
            }
            case 'INSTANCE': {
                const sNode = convertIntoSInstance(node);
                if (sParent) {
                    sNode.parent = sParent;
                }
                if (node.children) {
                    sNode.children = convertIntoSNodes(node.children, sNode);
                }
                return convertToAutoLayout(sNode);
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
                const sNode = convertIntoSFrame(node);
                if (sParent) {
                    sNode.parent = sParent;
                }
                sNode.children = convertIntoSNodes(node.children, sNode);
                return convertToAutoLayout(convertNodesOnRectangle(sNode));
            }
            default:
                return null;
        }
    });
    return mapped.filter(notEmpty);
};
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

const eventHandlers = {};
let currentId = 0;
/**
 * Registers an event `handler` for the given event `name`.
 *
 * @returns Returns a function for deregistering the `handler`.
 * @category Events
 */
function on(name, handler) {
    const id = `${currentId}`;
    currentId += 1;
    eventHandlers[id] = { handler, name };
    return function () {
        delete eventHandlers[id];
    };
}
/**
 * Calling `emit` in the main context invokes the event handler for the
 * matching event `name` in your UI. Correspondingly, calling `emit` in your
 * UI invokes the event handler for the matching event `name` in the main
 * context.
 *
 * All `args` passed after `name` will be directly
 * [applied](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
 * on the event handler.
 *
 * @category Events
 */
const emit = typeof window === 'undefined'
    ? function (name, ...args) {
        figma.ui.postMessage([name, ...args]);
    }
    : function (name, ...args) {
        window.parent.postMessage({
            pluginMessage: [name, ...args],
        }, '*');
    };
function invokeEventHandler(name, args) {
    for (const id in eventHandlers) {
        if (eventHandlers[id].name === name) {
            eventHandlers[id].handler.apply(null, args);
        }
    }
}
if (typeof window === 'undefined') {
    figma.ui.onmessage = function ([name, ...args]) {
        invokeEventHandler(name, args);
    };
}
else {
    window.onmessage = function (event) {
        const [name, ...args] = event.data.pluginMessage;
        invokeEventHandler(name, args);
    };
}

/**
 * Creates an `ImagePaint` object from the `bytes` of an image.
 *
 * @category Node
 */
function createImagePaint(bytes) {
    const image = figma.createImage(bytes);
    return {
        imageHash: image.hash,
        scaleMode: 'FILL',
        scalingFactor: 0.5,
        type: 'IMAGE'
    };
}

/**
 * Returns the node in the current document that has the given `id`.
 *
 * @category Node
 */
function getSceneNodeById(id) {
    const node = figma.getNodeById(id);
    if (node === null) {
        throw new Error(`No node found with \`id\`: ${id}`);
    }
    if (node.type === 'DOCUMENT' || node.type === 'PAGE') {
        throw new Error('`node` is not a `SceneNode`');
    }
    return node;
}

let parentId;
let layerName = false;
let assets = {};
let mode;
figma.showUI(__html__, { width: 450, height: 550 });
if (figma.command == 'addOnClick') ;
const run = () => {
    var _a, _b;
    if (figma.currentPage.selection.length === 0) {
        emit('empty');
        return;
    }
    // check [ignoreStackParent] description
    if (figma.currentPage.selection.length > 0) {
        const selection = figma.currentPage.selection;
        parentId = (_b = (_a = selection[0].parent) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
    }
    let result = '';
    debugger;
    const convertedSelection = convertIntoSNodes(figma.currentPage.selection, null);
    if (mode === 'tailwind') {
        result = tailwindMain(convertedSelection, parentId, layerName);
    }
    emit('result', result);
    // if (mode === 'tailwind') {
    // 	emit('colors', retrieveGenericSolidUIColors(convertedSelection, mode))
    // 	emit('gradients', retrieveGenericLinearGradients(convertedSelection, mode))
    // }
    // if (mode === 'tailwind') {
    // 	emit('text', retrieveTailwindText(convertedSelection))
    // }
};
function handleNodeSelection() {
    emit('selectionchange');
    const selection = figma.currentPage.selection;
    console.log('🇻🇳 ~ file: code.ts ~ line 67 ~ selection', selection);
    const isSingleSelection = selection.length === 1;
    if (isSingleSelection) {
        //  Can use convertIntoSNodes to achieved better node structure
        let node = convertIntoSingleSNode(selection[0], null);
        node.children = [];
        if (node) {
            emit('sceneNodeChange', node);
        }
    }
    run();
}
figma.on('selectionchange', () => {
    handleNodeSelection();
});
on('mount', () => {
    handleNodeSelection();
});
on('sceneNodeChangeBack', (payload) => {
    const { id, key, value } = payload;
    console.log('🇻🇳 ~ file: code.ts ~ line 122 ~ payload', payload);
    function setPluginData({ id, key, value }) {
        const screenNode = getSceneNodeById(id);
        screenNode.setPluginData(key, JSON.stringify(value));
    }
    switch (key) {
        case 'interactions':
            setPluginData({ id, key, value });
            break;
    }
});
on('createInstance', (args) => {
    const compName = 'Keypad';
    const comp = figma.createComponent();
    comp.name = compName;
    const rect = figma.createRectangle();
    const imgPaint = createImagePaint(assets[compName]);
    rect.fills = [imgPaint];
    comp.appendChild(rect);
    // figma.currentPage.selection = nodes
    // figma.viewport.scrollAndZoomIntoView(nodes)
});
on('tailwind', (args) => {
    mode = 'tailwind';
    if (args === null || args === void 0 ? void 0 : args.assets) {
        assets = args.assets;
    }
    run();
});
on('layerName', (args) => {
    if (args.data !== layerName) {
        layerName = args.data;
        run();
    }
});
on('refresh', () => {
    run();
});
