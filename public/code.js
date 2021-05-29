'use strict';

const nearestValue = (goal, array) => {
    return array.reduce(function (prev, curr) {
        return Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev;
    });
};
/**
 * convert pixel values to Tailwind attributes.
 * by default, Tailwind uses rem, while Figma uses px.
 * Therefore, a conversion is necessary. Rem = Pixel / 16.abs
 * Then, find in the corresponding table the closest value.
 */
const pixelToTailwindValue = (value, conversionMap) => {
    return conversionMap[nearestValue(value / 16, Object.keys(conversionMap).map((d) => +d))];
};
const mapLetterSpacing = {
    '-0.05': 'tighter',
    '-0.025': 'tight',
    // 0: "normal",
    0.025: 'wide',
    0.05: 'wider',
    0.1: 'widest',
};
const mapLineHeight = {
    0.75: '3',
    1: 'none',
    1.25: 'tight',
    1.375: 'snug',
    1.5: 'normal',
    1.625: 'relaxed',
    2: 'loose',
    1.75: '7',
    2.25: '9',
    2.5: '10',
};
const mapFontSize = {
    0.75: 'xs',
    0.875: 'sm',
    1: 'base',
    1.125: 'lg',
    1.25: 'xl',
    1.5: '2xl',
    1.875: '3xl',
    2.25: '4xl',
    3: '5xl',
    3.75: '6xl',
    4.5: '7xl',
    6: '8xl',
    8: '9xl',
};
const mapBorderRadius = {
    // 0: "none",
    0.125: '-sm',
    0.25: '',
    0.375: '-md',
    0.5: '-lg',
    0.75: '-xl',
    1.0: '-2xl',
    1.5: '-3xl',
    10: '-full',
};
const mapWidthHeightSize = {
    // 0: "0",
    0.125: '0.5',
    0.25: '1',
    0.375: '1.5',
    0.5: '2',
    0.625: '2.5',
    0.75: '3',
    0.875: '3.5',
    1: '4',
    1.25: '5',
    1.5: '6',
    1.75: '7',
    2: '8',
    2.25: '9',
    2.5: '10',
    2.75: '11',
    3: '12',
    3.5: '14',
    4: '16',
    5: '20',
    6: '24',
    7: '28',
    8: '32',
    9: '36',
    10: '40',
    11: '44',
    12: '48',
    13: '52',
    14: '56',
    15: '60',
    16: '64',
    18: '72',
    20: '80',
    24: '96',
};
const opacityValues = [
    0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95,
];
const nearestOpacity = (nodeOpacity) => nearestValue(nodeOpacity * 100, opacityValues);
const pxToLetterSpacing = (value) => pixelToTailwindValue(value, mapLetterSpacing);
const pxToLineHeight = (value) => pixelToTailwindValue(value, mapLineHeight);
const pxToFontSize = (value) => pixelToTailwindValue(value, mapFontSize);
const pxToBorderRadius = (value) => pixelToTailwindValue(value, mapBorderRadius);
const pxToLayoutSize = (value) => pixelToTailwindValue(value, mapWidthHeightSize);

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

/**
 * Retrieve the first visible color that is being used by the layer, in case there are more than one.
 */
const retrieveTopFill = (fills) => {
    if (fills && fills !== figma.mixed && fills.length > 0) {
        // on Figma, the top layer is always at the last position
        // reverse, then try to find the first layer that is visible, if any.
        return [...fills].reverse().find((d) => d.visible !== false);
    }
};

const gradientAngle = (fill) => {
    // Thanks Gleb and Liam for helping!
    const decomposed = decomposeRelativeTransform(fill.gradientTransform[0], fill.gradientTransform[1]);
    return (decomposed.rotation * 180) / Math.PI;
};
// from https://math.stackexchange.com/a/2888105
const decomposeRelativeTransform = (t1, t2) => {
    const a = t1[0];
    const b = t1[1];
    const c = t1[2];
    const d = t2[0];
    const e = t2[1];
    const f = t2[2];
    const delta = a * d - b * c;
    const result = {
        translation: [e, f],
        rotation: 0,
        scale: [0, 0],
        skew: [0, 0],
    };
    // Apply the QR-like decomposition.
    if (a !== 0 || b !== 0) {
        const r = Math.sqrt(a * a + b * b);
        result.rotation = b > 0 ? Math.acos(a / r) : -Math.acos(a / r);
        result.scale = [r, delta / r];
        result.skew = [Math.atan((a * c + b * d) / (r * r)), 0];
    }
    // these are not currently being used.
    // else if (c != 0 || d != 0) {
    //   const s = Math.sqrt(c * c + d * d);
    //   result.rotation =
    //     Math.PI / 2 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
    //   result.scale = [delta / s, s];
    //   result.skew = [0, Math.atan((a * c + b * d) / (s * s))];
    // } else {
    //   // a = b = c = d = 0
    // }
    return result;
};

// retrieve the SOLID color for tailwind
const tailwindColorFromFills = (fills, kind) => {
    // kind can be text, bg, border...
    // [when testing] fills can be undefined
    const fill = retrieveTopFill(fills);
    if ((fill === null || fill === void 0 ? void 0 : fill.type) === 'SOLID') {
        // don't set text color when color is black (default) and opacity is 100%
        return tailwindSolidColor(fill, kind);
    }
    return '';
};
const tailwindSolidColor = (fill, kind) => {
    var _a;
    // don't set text color when color is black (default) and opacity is 100%
    if (kind === 'text' &&
        fill.color.r === 0.0 &&
        fill.color.g === 0.0 &&
        fill.color.b === 0.0 &&
        fill.opacity === 1.0) {
        return '';
    }
    const opacity = (_a = fill.opacity) !== null && _a !== void 0 ? _a : 1.0;
    // example: text-opacity-50
    // ignore the 100. If opacity was changed, let it be visible.
    const opacityProp = opacity !== 1.0 ? `${kind}-opacity-${nearestOpacity(opacity)} ` : '';
    // example: text-red-500
    const colorProp = `${kind}-${getTailwindFromFigmaRGB(fill.color)} `;
    // if fill isn't visible, it shouldn't be painted.
    return `${colorProp}${opacityProp}`;
};
/**
 * https://tailwindcss.com/docs/box-shadow/
 * example: shadow
 */
const tailwindGradientFromFills = (fills) => {
    // [when testing] node.effects can be undefined
    const fill = retrieveTopFill(fills);
    if ((fill === null || fill === void 0 ? void 0 : fill.type) === 'GRADIENT_LINEAR') {
        return tailwindGradient(fill);
    }
    return '';
};
const tailwindGradient = (fill) => {
    const direction = gradientDirection(gradientAngle(fill));
    if (fill.gradientStops.length === 1) {
        const fromColor = getTailwindFromFigmaRGB(fill.gradientStops[0].color);
        return `${direction} from-${fromColor} `;
    }
    else if (fill.gradientStops.length === 2) {
        const fromColor = getTailwindFromFigmaRGB(fill.gradientStops[0].color);
        const toColor = getTailwindFromFigmaRGB(fill.gradientStops[1].color);
        return `${direction} from-${fromColor} to-${toColor} `;
    }
    else {
        const fromColor = getTailwindFromFigmaRGB(fill.gradientStops[0].color);
        // middle (second color)
        const viaColor = getTailwindFromFigmaRGB(fill.gradientStops[1].color);
        // last
        const toColor = getTailwindFromFigmaRGB(fill.gradientStops[fill.gradientStops.length - 1].color);
        return `${direction} from-${fromColor} via-${viaColor} to-${toColor} `;
    }
};
const gradientDirection = (angle) => {
    switch (nearestValue(angle, [-180, -135, -90, -45, 0, 45, 90, 135, 180])) {
        case 0:
            return 'bg-gradient-to-r';
        case 45:
            return 'bg-gradient-to-br';
        case 90:
            return 'bg-gradient-to-b';
        case 135:
            return 'bg-gradient-to-bl';
        case -45:
            return 'bg-gradient-to-tr';
        case -90:
            return 'bg-gradient-to-t';
        case -135:
            return 'bg-gradient-to-tl';
        default:
            // 180 and -180
            return 'bg-gradient-to-l';
    }
};
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
const tailwindNearestColor = nearestColorFrom(Object.keys(tailwindColors));
// figma uses r,g,b in [0, 1], while nearestColor uses it in [0, 255]
const getTailwindFromFigmaRGB = (color) => {
    const colorMultiplied = {
        r: color.r * 255,
        g: color.g * 255,
        b: color.b * 255,
    };
    return tailwindColors[tailwindNearestColor(colorMultiplied)];
};

const commonLineHeight = (node) => {
    if (node.lineHeight !== figma.mixed &&
        node.lineHeight.unit !== 'AUTO' &&
        Math.round(node.lineHeight.value) !== 0) {
        if (node.lineHeight.unit === 'PIXELS') {
            return node.lineHeight.value;
        }
        else {
            if (node.fontSize !== figma.mixed) {
                // based on tests, using Inter font with varied sizes and weights, this works.
                // example: 24 * 20 / 100 = 4.8px, which is correct visually.
                return (node.fontSize * node.lineHeight.value) / 100;
            }
        }
    }
    return 0;
};
const commonLetterSpacing = (node) => {
    if (node.letterSpacing !== figma.mixed &&
        Math.round(node.letterSpacing.value) !== 0) {
        if (node.letterSpacing.unit === 'PIXELS') {
            return node.letterSpacing.value;
        }
        else {
            if (node.fontSize !== figma.mixed) {
                // read [commonLineHeight] comment to understand what is going on here.
                return (node.fontSize * node.letterSpacing.value) / 100;
            }
        }
    }
    return 0;
};

/**
 * https://tailwindcss.com/docs/box-shadow/
 * example: shadow
 */
const tailwindShadow = (node) => {
    // [when testing] node.effects can be undefined
    if (node.effects && node.effects.length > 0) {
        const dropShadow = node.effects.filter((d) => d.type === 'DROP_SHADOW' && d.visible !== false);
        let boxShadow = '';
        // simple shadow from tailwind
        if (dropShadow.length > 0) {
            boxShadow = 'shadow ';
        }
        const innerShadow = node.effects.filter((d) => d.type === 'INNER_SHADOW')
            .length > 0
            ? 'shadow-inner '
            : '';
        return boxShadow + innerShadow;
        // todo customize the shadow
        // TODO layer blur, shadow-outline
    }
    return '';
};

/**
 * https://tailwindcss.com/docs/opacity/
 * default is [0, 25, 50, 75, 100], but '100' will be ignored:
 * if opacity was changed, let it be visible. Therefore, 98% => 75
 * node.opacity is between [0, 1]; output will be [0, 100]
 */
const tailwindOpacity = (node) => {
    // [when testing] node.opacity can be undefined
    if (node.opacity !== undefined && node.opacity !== 1) {
        return `opacity-${nearestOpacity(node.opacity)} `;
    }
    return '';
};
/**
 * https://tailwindcss.com/docs/visibility/
 * example: invisible
 */
const tailwindVisibility = (node) => {
    // [when testing] node.visible can be undefined
    // When something is invisible in Figma, it isn't gone. Groups can make use of it.
    // Therefore, instead of changing the visibility (which causes bugs in nested divs),
    // this plugin is going to ignore color and stroke
    if (node.visible !== undefined && !node.visible) {
        return 'invisible ';
    }
    return '';
};
/**
 * https://tailwindcss.com/docs/rotate/
 * default is [-180, -90, -45, 0, 45, 90, 180], but '0' will be ignored:
 * if rotation was changed, let it be perceived. Therefore, 1 => 45
 */
const tailwindRotation = (node) => {
    // that's how you convert angles to clockwise radians: angle * -pi/180
    // using 3.14159 as Pi for enough precision and to avoid importing math lib.
    if (node.rotation !== undefined && Math.round(node.rotation) !== 0) {
        const allowedValues = [
            -180, -90, -45, -12, -6, -3, -2, -1, 1, 2, 3, 6, 12, 45, 90, 180,
        ];
        let nearest = nearestValue(node.rotation, allowedValues);
        let minusIfNegative = '';
        if (nearest < 0) {
            minusIfNegative = '-';
            nearest = -nearest;
        }
        return `transform ${minusIfNegative}rotate-${nearest} `;
    }
    return '';
};

/**
 * https://tailwindcss.com/docs/border-width/
 * example: border-2
 */
const tailwindBorderWidth = (node) => {
    // [node.strokeWeight] can have a value even when there are no strokes
    // [when testing] node.effects can be undefined
    if (node.strokes && node.strokes.length > 0 && node.strokeWeight > 0) {
        const allowedValues = [1, 2, 4, 8];
        const nearest = nearestValue(node.strokeWeight, allowedValues);
        if (nearest === 1) {
            // special case
            return 'border ';
        }
        else {
            return `border-${nearest} `;
        }
    }
    return '';
};
/**
 * https://tailwindcss.com/docs/border-radius/
 * example: rounded-sm
 * example: rounded-tr-lg
 */
const tailwindBorderRadius = (node) => {
    if (node.type === 'ELLIPSE') {
        return 'rounded-full ';
    }
    else if ((!('cornerRadius' in node) && !('topLeftRadius' in node)) ||
        (node.cornerRadius === figma.mixed && node.topLeftRadius === undefined) ||
        node.cornerRadius === 0) {
        // the second condition is used on tests. On Figma, topLeftRadius is never undefined.
        // ignore when 0, undefined or non existent
        return '';
    }
    let comp = '';
    if (node.cornerRadius !== figma.mixed) {
        if (node.cornerRadius >= node.height / 2) {
            // special case. If height is 90 and cornerRadius is 45, it is full.
            comp += 'rounded-full ';
        }
        else {
            comp += `rounded${pxToBorderRadius(node.cornerRadius)} `;
        }
    }
    else {
        // todo optimize for tr/tl/br/bl instead of t/r/l/b
        if (node.topLeftRadius !== 0) {
            comp += `rounded-tl${pxToBorderRadius(node.topLeftRadius)} `;
        }
        if (node.topRightRadius !== 0) {
            comp += `rounded-tr${pxToBorderRadius(node.topRightRadius)} `;
        }
        if (node.bottomLeftRadius !== 0) {
            comp += `rounded-bl${pxToBorderRadius(node.bottomLeftRadius)} `;
        }
        if (node.bottomRightRadius !== 0) {
            comp += `rounded-br${pxToBorderRadius(node.bottomRightRadius)} `;
        }
    }
    return comp;
};

/**
 * In Figma, Groups have absolute position while Frames have relative.
 * This is a helper to retrieve the node.parent.x without worries.
 * Usually, after this is called, node.x - parentX is done to solve that scenario.
 *
 * Input is expected to be node.parent.
 */
const parentCoordinates = (node) => {
    const parentX = 'layoutMode' in node ? 0 : node.x;
    const parentY = 'layoutMode' in node ? 0 : node.y;
    return [parentX, parentY];
};

const commonPosition = (node) => {
    // if node is same size as height, position is not necessary
    var _a, _b, _c, _d;
    // detect if Frame's width is same as Child when Frame has Padding.
    // warning: this may return true even when false, if size is same, but position is different. However, it would be an unexpected layout.
    let hPadding = 0;
    let vPadding = 0;
    if (node.parent && 'layoutMode' in node.parent) {
        hPadding = ((_a = node.parent.paddingLeft) !== null && _a !== void 0 ? _a : 0) + ((_b = node.parent.paddingRight) !== null && _b !== void 0 ? _b : 0);
        vPadding = ((_c = node.parent.paddingTop) !== null && _c !== void 0 ? _c : 0) + ((_d = node.parent.paddingBottom) !== null && _d !== void 0 ? _d : 0);
    }
    if (!node.parent ||
        (node.width === node.parent.width - hPadding &&
            node.height === node.parent.height - vPadding)) {
        return '';
    }
    // position is absolute, parent is relative
    // return "absolute inset-0 m-auto ";
    const [parentX, parentY] = parentCoordinates(node.parent);
    // if view is too small, anything will be detected; this is necessary to reduce the tolerance.
    let threshold = 8;
    if (node.width < 16 || node.height < 16) {
        threshold = 1;
    }
    // < 4 is a threshold. If === is used, there can be rounding errors (28.002 !== 28)
    const centerX = Math.abs(2 * (node.x - parentX) + node.width - node.parent.width) <
        threshold;
    const centerY = Math.abs(2 * (node.y - parentY) + node.height - node.parent.height) <
        threshold;
    const minX = node.x - parentX < threshold;
    const minY = node.y - parentY < threshold;
    const maxX = node.parent.width - (node.x - parentX + node.width) < threshold;
    const maxY = node.parent.height - (node.y - parentY + node.height) < threshold;
    // this needs to be on top, because Tailwind is incompatible with Center, so this will give preference.
    if (minX && minY) {
        // x left, y top
        return 'TopStart';
    }
    else if (minX && maxY) {
        // x left, y bottom
        return 'BottomStart';
    }
    else if (maxX && minY) {
        // x right, y top
        return 'TopEnd';
    }
    else if (maxX && maxY) {
        // x right, y bottom
        return 'BottomEnd';
    }
    if (centerX && centerY) {
        return 'Center';
    }
    if (centerX) {
        if (minY) {
            // x center, y top
            return 'TopCenter';
        }
        if (maxY) {
            // x center, y bottom
            return 'BottomCenter';
        }
    }
    else if (centerY) {
        if (minX) {
            // x left, y center
            return 'CenterStart';
        }
        if (maxX) {
            // x right, y center
            return 'CenterEnd';
        }
    }
    return 'Absolute';
};

const tailwindPosition = (node, parentId = '', hasFixedSize = false) => {
    // don't add position to the first (highest) node in the tree
    if (!node.parent || parentId === node.parent.id) {
        return '';
    }
    // Group
    if (node.parent.isRelative === true) {
        // position is absolute, needs to be relative
        return retrieveAbsolutePos(node, hasFixedSize);
    }
    return '';
};
const retrieveAbsolutePos = (node, hasFixedSize) => {
    // everything related to Center requires a defined width and height. Therefore, we use hasFixedSize.
    switch (commonPosition(node)) {
        case '':
            return '';
        case 'Absolute':
            return 'absoluteManualLayout';
        case 'TopCenter':
            if (hasFixedSize) {
                return 'absolute inset-x-0 top-0 mx-auto ';
            }
            return 'absoluteManualLayout';
        case 'CenterStart':
            if (hasFixedSize) {
                return 'absolute inset-y-0 left-0 my-auto ';
            }
            return 'absoluteManualLayout';
        case 'Center':
            if (hasFixedSize) {
                return 'absolute m-auto inset-0 ';
            }
            return 'absoluteManualLayout';
        case 'CenterEnd':
            if (hasFixedSize) {
                return 'absolute inset-y-0 right-0 my-auto ';
            }
            return 'absoluteManualLayout';
        case 'BottomCenter':
            if (hasFixedSize) {
                return 'absolute inset-x-0 bottom-0 mx-auto ';
            }
            return 'absoluteManualLayout';
        case 'TopStart':
            return 'absolute left-0 top-0 ';
        case 'TopEnd':
            return 'absolute right-0 top-0 ';
        case 'BottomStart':
            return 'absolute left-0 bottom-0 ';
        case 'BottomEnd':
            return 'absolute right-0 bottom-0 ';
    }
};

const nodeWidthHeight = (node, allowRelative) => {
    /// WIDTH AND HEIGHT
    var _a;
    // if parent is a page, width can't get past w-64, therefore let it be free
    // if (node.parent?.type === "PAGE" && node.width > 256) {
    //   return "";
    // }
    if (node.layoutAlign === 'STRETCH' && node.layoutGrow === 1) {
        return {
            width: 'full',
            height: 'full',
        };
    }
    const [nodeWidth, nodeHeight] = getNodeSizeWithStrokes(node);
    let propWidth = nodeWidth;
    let propHeight = nodeHeight;
    if (node.parent && 'layoutMode' in node.parent) {
        // Stretch means the opposite direction
        if (node.layoutAlign === 'STRETCH') {
            switch (node.parent.layoutMode) {
                case 'HORIZONTAL':
                    propHeight = 'full';
                    break;
                case 'VERTICAL':
                    propWidth = 'full';
                    break;
            }
        }
        // Grow means the same direction
        if (node.layoutGrow === 1) {
            if (node.parent.layoutMode === 'HORIZONTAL') {
                propWidth = 'full';
            }
            else {
                propHeight = 'full';
            }
        }
    }
    // avoid relative width when parent is relative (therefore, child is probably absolute, which doesn't work nice)
    // ignore for root layer
    // todo should this be kept this way? The issue is w-full which doesn't work well with absolute position.
    if (allowRelative && ((_a = node.parent) === null || _a === void 0 ? void 0 : _a.isRelative) !== true) {
        // don't calculate again if it was already calculated
        if (propWidth !== 'full') {
            const rW = calculateResponsiveWH(node, nodeWidth, 'x');
            if (rW) {
                propWidth = rW;
            }
        }
        if (propHeight !== 'full') {
            const rH = calculateResponsiveWH(node, nodeHeight, 'y');
            if (rH && node.parent) {
                propHeight = rH;
            }
        }
    }
    // when any child has a relative width and parent is HORIZONTAL,
    // parent must have a defined width, which wouldn't otherwise.
    // todo check if the performance impact of this is worth it.
    // const hasRelativeChildW =
    //   allowRelative &&
    //   "children" in node &&
    //   node.children.find((d) =>
    //     calculateResponsiveWH(d, getNodeSizeWithStrokes(d)[0], "x")
    //   ) !== undefined;
    // when the child has the same size as the parent, don't set the size of the parent (twice)
    if ('children' in node && node.children && node.children.length === 1) {
        const child = node.children[0];
        // detect if Frame's width is same as Child when Frame has Padding.
        let hPadding = 0;
        let vPadding = 0;
        if ('layoutMode' in node) {
            hPadding = node.paddingLeft + node.paddingRight;
            vPadding = node.paddingTop + node.paddingBottom;
        }
        // set them independently, in case w is equal but h isn't
        if (child.width === nodeWidth - hPadding) ;
        if (child.height === nodeHeight - vPadding) ;
    }
    if ('layoutMode' in node) {
        if ((node.layoutMode === 'HORIZONTAL' &&
            node.counterAxisSizingMode === 'AUTO') ||
            (node.layoutMode === 'VERTICAL' && node.primaryAxisSizingMode === 'AUTO')) {
            propHeight = null;
        }
        if ((node.layoutMode === 'VERTICAL' &&
            node.counterAxisSizingMode === 'AUTO') ||
            (node.layoutMode === 'HORIZONTAL' &&
                node.primaryAxisSizingMode === 'AUTO')) {
            propWidth = null;
        }
    }
    // On Tailwind, do not let the size be larger than 384.
    if (allowRelative) {
        if ((node.type !== 'RECTANGLE' && nodeHeight > 384) ||
            childLargerThanMaxSize(node, 'y')) {
            propHeight = null;
        }
        else if ((node.type !== 'RECTANGLE' && nodeWidth > 384) ||
            childLargerThanMaxSize(node, 'x')) {
            propWidth = null;
        }
    }
    if ('layoutMode' in node && node.layoutMode !== 'NONE') {
        // there is an edge case: frame with no children, layoutMode !== NONE and counterAxis = AUTO, but:
        // in [altConversions] it is already solved: Frame without children becomes a Rectangle.
        switch (node.layoutMode) {
            case 'HORIZONTAL':
                return {
                    width: node.primaryAxisSizingMode === 'FIXED' ? propWidth : null,
                    height: node.counterAxisSizingMode === 'FIXED' ? propHeight : null,
                };
            case 'VERTICAL':
                return {
                    width: node.counterAxisSizingMode === 'FIXED' ? propWidth : null,
                    height: node.primaryAxisSizingMode === 'FIXED' ? propHeight : null,
                };
        }
    }
    else {
        return {
            width: propWidth,
            height: propHeight,
        };
    }
};
// makes the view size bigger when there is a stroke
const getNodeSizeWithStrokes = (node) => {
    let nodeHeight = node.height;
    let nodeWidth = node.width;
    // tailwind doesn't support OUTSIDE or CENTER, only INSIDE.
    // Therefore, to give the same feeling, the height and width will be slighly increased.
    // node.strokes.lenght is necessary because [strokeWeight] can exist even without strokes.
    if ('strokes' in node && node.strokes && node.strokes.length) {
        if (node.strokeAlign === 'OUTSIDE') {
            nodeHeight += node.strokeWeight * 2;
            nodeWidth += node.strokeWeight * 2;
        }
        else if (node.strokeAlign === 'CENTER') {
            nodeHeight += node.strokeWeight;
            nodeWidth += node.strokeWeight;
        }
    }
    if ('children' in node) {
        // if any children has an OUTSIDE or CENTER stroke and, with that stroke,
        // the child gets a size bigger than parent, adjust parent to be larger
        node.children.forEach((d) => {
            var _a;
            if ('strokeWeight' in d && ((_a = d.strokes) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                if (d.strokeAlign === 'OUTSIDE') {
                    if (nodeWidth < d.width + d.strokeWeight * 2) {
                        nodeWidth += d.strokeWeight * 2;
                    }
                    if (nodeHeight < d.height + d.strokeWeight * 2) {
                        nodeHeight += d.strokeWeight * 2;
                    }
                }
                else if (d.strokeAlign === 'CENTER') {
                    if (nodeWidth < d.width + d.strokeWeight) {
                        nodeWidth += d.strokeWeight;
                    }
                    if (nodeHeight < d.height + d.strokeWeight) {
                        nodeHeight += d.strokeWeight;
                    }
                }
            }
        });
    }
    return [nodeWidth, nodeHeight];
};
const childLargerThanMaxSize = (node, axis) => {
    if ('children' in node && node.children.length > 0) {
        const widthHeight = axis === 'x' ? 'width' : 'height';
        const lastChild = node.children[node.children.length - 1];
        const maxLen = lastChild[axis] + lastChild[widthHeight] - node.children[0][axis];
        return maxLen > 384;
    }
    return false;
};
const calculateResponsiveWH = (node, nodeWidthHeight, axis) => {
    let returnValue = '';
    if (nodeWidthHeight > 384 || childLargerThanMaxSize(node, axis)) {
        returnValue = 'full';
    }
    if (!node.parent) {
        return returnValue;
    }
    let parentWidthHeight;
    if ('layoutMode' in node.parent && node.parent.layoutMode !== 'NONE') {
        if (axis === 'x') {
            // subtract padding from the layout width, so it can be full when compared with parent.
            parentWidthHeight =
                node.parent.width - node.parent.paddingLeft - node.parent.paddingRight;
        }
        else {
            // subtract padding from the layout height, so it can be full when compared with parent.
            parentWidthHeight =
                node.parent.height - node.parent.paddingTop - node.parent.paddingBottom;
        }
    }
    else {
        parentWidthHeight = axis === 'x' ? node.parent.width : node.parent.height;
    }
    // 0.01 of tolerance is enough for 5% of diff, i.e.: 804 / 400
    const dividedWidth = nodeWidthHeight / parentWidthHeight;
    const calculateResp = (div, str) => {
        if (Math.abs(dividedWidth - div) < 0.01) {
            returnValue = str;
            return true;
        }
        return false;
    };
    // they will try to set the value, and if false keep calculating
    const checkList = [
        [1, 'full'],
        [1 / 2, '1/2'],
        [1 / 3, '1/3'],
        [2 / 3, '2/3'],
        [1 / 4, '1/4'],
        [3 / 4, '3/4'],
        [1 / 5, '1/5'],
        [1 / 6, '1/6'],
        [5 / 6, '5/6'],
    ];
    // exit the for when result is found.
    let resultFound = false;
    for (let i = 0; i < checkList.length && !resultFound; i++) {
        const [div, resp] = checkList[i];
        resultFound = calculateResp(div, resp);
    }
    // todo this was commented because it is almost never used. Should it be uncommented?
    // if (!resultFound && isWidthFull(node, nodeWidth, parentWidth)) {
    //   propWidth = "full";
    // }
    return returnValue;
};
// set the width to max if the view is near the corner
// export const isWidthFull = (
//   node: AltSceneNode,
//   nodeWidth: number,
//   parentWidth: number
// ): boolean => {
//   // check if initial and final positions are within a magic number (currently 32)
//   // this will only be reached when parent is FRAME, so node.parent.x is always 0.
//   const betweenValueMargins =
//     node.x <= magicMargin && parentWidth - (node.x + nodeWidth) <= magicMargin;
//   // check if total width is at least 80% of the parent. This number is also a magic number and has worked fine so far.
//   const betweenPercentMargins = nodeWidth / parentWidth >= 0.8;
//   if (betweenValueMargins && betweenPercentMargins) {
//     return true;
//   }
//   return false;
// };

// this is necessary to avoid a height of 4.999999523162842.
const numToAutoFixed = (num) => {
    return num.toFixed(2).replace(/\.00$/, '');
};

const formatWithJSX = (property, isJsx, value) => {
    // convert font-size to fontSize.
    const jsx_property = property
        .split('-')
        .map((d, i) => (i > 0 ? d.charAt(0).toUpperCase() + d.slice(1) : d))
        .join('');
    if (typeof value === 'number') {
        if (isJsx) {
            return `${jsx_property}: ${numToAutoFixed(value)}, `;
        }
        else {
            return `${property}: ${numToAutoFixed(value)}px; `;
        }
    }
    else {
        if (isJsx) {
            return `${jsx_property}: '${value}', `;
        }
        else {
            return `${property}: ${value}; `;
        }
    }
};

const tailwindSizePartial = (node) => {
    const size = nodeWidthHeight(node, true);
    let w = '';
    if (typeof size.width === 'number') {
        w += `w-${pxToLayoutSize(size.width)} `;
    }
    else if (typeof size.width === 'string') {
        if (size.width === 'full' &&
            node.parent &&
            'layoutMode' in node.parent &&
            node.parent.layoutMode === 'HORIZONTAL') {
            w += `flex-1 `;
        }
        else {
            w += `w-${size.width} `;
        }
    }
    let h = '';
    if (typeof size.height === 'number') {
        h = `h-${pxToLayoutSize(size.height)} `;
    }
    else if (typeof size.height === 'string') {
        if (size.height === 'full' &&
            node.parent &&
            'layoutMode' in node.parent &&
            node.parent.layoutMode === 'VERTICAL') {
            h += `flex-1 `;
        }
        else {
            h += `h-${size.height} `;
        }
    }
    return [w, h];
};
/**
 * https://www.w3schools.com/css/css_dimension.asp
 */
const htmlSizeForTailwind = (node, isJSX) => {
    return htmlSizePartialForTailwind(node).join('');
};
const htmlSizePartialForTailwind = (node, isJSX) => {
    // todo refactor with formatWithJSX when more attribute to come
    return [
        `w-[${numToAutoFixed(node.width)}px] `,
        `h-[${numToAutoFixed(node.height)}px] `,
    ];
    // return [
    //   formatWithJSX("width", isJSX, node.width),
    //   formatWithJSX("height", isJSX, node.height),
    // ];
};

/**
 * Add padding if necessary.
 * Padding is currently only valid for auto layout.
 * Padding can have values even when AutoLayout is off
 */
const commonPadding = (node) => {
    var _a, _b, _c, _d;
    if ('layoutMode' in node && node.layoutMode !== 'NONE') {
        // round the numbers to avoid 5 being different than 5.00001
        // fix it if undefined (in tests)
        node.paddingLeft = Math.round((_a = node.paddingLeft) !== null && _a !== void 0 ? _a : 0);
        node.paddingRight = Math.round((_b = node.paddingRight) !== null && _b !== void 0 ? _b : 0);
        node.paddingTop = Math.round((_c = node.paddingTop) !== null && _c !== void 0 ? _c : 0);
        node.paddingBottom = Math.round((_d = node.paddingBottom) !== null && _d !== void 0 ? _d : 0);
        const arr = {
            horizontal: 0,
            vertical: 0,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        };
        if (node.paddingLeft > 0 &&
            node.paddingLeft === node.paddingRight &&
            node.paddingLeft === node.paddingBottom &&
            node.paddingTop === node.paddingBottom) {
            return { all: node.paddingLeft };
        }
        else if (node.paddingLeft > 0 && node.paddingLeft === node.paddingRight) {
            // horizontal padding + vertical + individual paddings
            arr.horizontal = node.paddingLeft;
            if (node.paddingTop > 0 && node.paddingTop === node.paddingBottom) {
                arr.vertical = node.paddingTop;
            }
            else {
                if (node.paddingTop > 0) {
                    arr.top = node.paddingTop;
                }
                if (node.paddingBottom > 0) {
                    arr.bottom = node.paddingBottom;
                }
            }
        }
        else if (node.paddingTop > 0 && node.paddingTop === node.paddingBottom) {
            // vertical padding + individual paddings
            arr.vertical = node.paddingBottom;
            if (node.paddingLeft > 0) {
                arr.left = node.paddingLeft;
            }
            if (node.paddingRight > 0) {
                arr.right = node.paddingRight;
            }
        }
        else {
            // individual paddings
            if (node.paddingLeft > 0) {
                arr.left = node.paddingLeft;
            }
            if (node.paddingRight > 0) {
                arr.right = node.paddingRight;
            }
            if (node.paddingTop > 0) {
                arr.top = node.paddingTop;
            }
            if (node.paddingBottom > 0) {
                arr.bottom = node.paddingBottom;
            }
        }
        return arr;
    }
    return null;
};

/**
 * https://tailwindcss.com/docs/margin/
 * example: px-2 py-8
 */
const tailwindPadding = (node) => {
    const padding = commonPadding(node);
    if (!padding) {
        return '';
    }
    if ('all' in padding) {
        return `p-${pxToLayoutSize(padding.all)} `;
    }
    let comp = '';
    // horizontal and vertical, as the default AutoLayout
    if (padding.horizontal) {
        comp += `px-${pxToLayoutSize(padding.horizontal)} `;
    }
    if (padding.vertical) {
        comp += `py-${pxToLayoutSize(padding.vertical)} `;
    }
    // if left and right exists, verify if they are the same after [pxToLayoutSize] conversion.
    if (padding.left && padding.right) {
        const left = pxToLayoutSize(padding.left);
        const right = pxToLayoutSize(padding.right);
        if (left === right) {
            comp += `px-${left} `;
        }
        else {
            comp += `pl-${left} pr-${right} `;
        }
    }
    else if (padding.left) {
        comp += `pl-${pxToLayoutSize(padding.left)} `;
    }
    else if (padding.right) {
        comp += `pr-${pxToLayoutSize(padding.right)} `;
    }
    // if top and bottom exists, verify if they are the same after [pxToLayoutSize] conversion.
    if (padding.top && padding.bottom) {
        const top = pxToLayoutSize(padding.top);
        const bottom = pxToLayoutSize(padding.bottom);
        if (top === bottom) {
            comp += `py-${top} `;
        }
        else {
            comp += `pt-${top} pb-${bottom} `;
        }
    }
    else if (padding.top) {
        comp += `pt-${pxToLayoutSize(padding.top)} `;
    }
    else if (padding.bottom) {
        comp += `pb-${pxToLayoutSize(padding.bottom)} `;
    }
    return comp;
};

class TailwindDefaultBuilder {
    constructor(node, showLayerName, optIsJSX) {
        this.attributes = '';
        this.styleSeparator = '';
        this.name = '';
        this.hasFixedSize = false;
        this.isJSX = optIsJSX;
        this.styleSeparator = this.isJSX ? ',' : ';';
        this.style = '';
        this.visible = node.visible;
        if (showLayerName) {
            this.name = node.name.replace(' ', '') + ' ';
        }
    }
    blend(node) {
        this.attributes += tailwindVisibility(node);
        this.attributes += tailwindRotation(node);
        this.attributes += tailwindOpacity(node);
        return this;
    }
    border(node) {
        this.attributes += tailwindBorderWidth(node);
        this.attributes += tailwindBorderRadius(node);
        this.customColor(node.strokes, 'border');
        return this;
    }
    position(node, parentId, isRelative = false) {
        const position = tailwindPosition(node, parentId, this.hasFixedSize);
        if (position === 'absoluteManualLayout' && node.parent) {
            // tailwind can't deal with absolute layouts.
            const [parentX, parentY] = parentCoordinates(node.parent);
            const left = node.x - parentX;
            const top = node.y - parentY;
            this.style += formatWithJSX('left', this.isJSX, left);
            this.style += formatWithJSX('top', this.isJSX, top);
            if (!isRelative) {
                this.attributes += 'absolute ';
            }
        }
        else {
            this.attributes += position;
        }
        return this;
    }
    /**
     * https://tailwindcss.com/docs/text-color/
     * example: text-blue-500
     * example: text-opacity-25
     * example: bg-blue-500
     */
    customColor(paint, kind) {
        // visible is true or undefinied (tests)
        if (this.visible !== false) {
            let gradient = '';
            if (kind === 'bg') {
                gradient = tailwindGradientFromFills(paint);
            }
            if (gradient) {
                this.attributes += gradient;
            }
            else {
                this.attributes += tailwindColorFromFills(paint, kind);
            }
        }
        return this;
    }
    /**
     * https://tailwindcss.com/docs/box-shadow/
     * example: shadow
     */
    shadow(node) {
        this.attributes += tailwindShadow(node);
        return this;
    }
    // must be called before Position, because of the hasFixedSize attribute.
    widthHeight(node) {
        // if current element is relative (therefore, children are absolute)
        // or current element is one of the absoltue children and has a width or height > w/h-64
        var _a;
        if ('isRelative' in node && node.isRelative === true) {
            this.style += htmlSizeForTailwind(node, this.isJSX);
        }
        else if (((_a = node.parent) === null || _a === void 0 ? void 0 : _a.isRelative) === true ||
            node.width > 384 ||
            node.height > 384) {
            // to avoid mixing html and tailwind sizing too much, only use html sizing when absolutely necessary.
            // therefore, if only one attribute is larger than 256, only use the html size in there.
            const [tailwindWidth, tailwindHeight] = tailwindSizePartial(node);
            const [htmlWidth, htmlHeight] = htmlSizePartialForTailwind(node, this.isJSX);
            // when textAutoResize is NONE or WIDTH_AND_HEIGHT, it has a defined width.
            if (node.type !== 'TEXT' || node.textAutoResize !== 'WIDTH_AND_HEIGHT') {
                if (node.width > 384) {
                    this.attributes += htmlWidth;
                }
                else {
                    this.attributes += tailwindWidth;
                }
                this.hasFixedSize = htmlWidth !== '';
            }
            // when textAutoResize is NONE has a defined height.
            if (node.type !== 'TEXT' || node.textAutoResize === 'NONE') {
                if (node.width > 384) {
                    // this.style += htmlHeight
                    this.attributes += htmlHeight;
                }
                else {
                    this.attributes += tailwindHeight;
                }
                this.hasFixedSize = htmlHeight !== '';
            }
        }
        else {
            const partial = tailwindSizePartial(node);
            // Width
            if (node.type !== 'TEXT' || node.textAutoResize !== 'WIDTH_AND_HEIGHT') {
                this.attributes += partial[0];
            }
            // Height
            if (node.type !== 'TEXT' || node.textAutoResize === 'NONE') {
                this.attributes += partial[1];
            }
            this.hasFixedSize = partial[0] !== '' && partial[1] !== '';
        }
        return this;
    }
    autoLayoutPadding(node) {
        this.attributes += tailwindPadding(node);
        return this;
    }
    removeTrailingSpace() {
        if (this.attributes.length > 0 && this.attributes.slice(-1) === ' ') {
            this.attributes = this.attributes.slice(0, -1);
        }
        if (this.style.length > 0 && this.style.slice(-1) === ' ') {
            this.style = this.style.slice(0, -1);
        }
        return this;
    }
    build(additionalAttr = '') {
        this.attributes = this.name + additionalAttr + this.attributes;
        this.removeTrailingSpace();
        if (this.style) {
            if (this.isJSX) {
                this.style = ` style={{${this.style}}}`;
            }
            else {
                this.style = ` style="${this.style}"`;
            }
        }
        if (!this.attributes && !this.style) {
            return '';
        }
        const classOrClassName = this.isJSX ? 'className' : 'class';
        return ` ${classOrClassName}="${this.attributes}"${this.style}`;
    }
    reset() {
        this.attributes = '';
    }
}

class TailwindTextBuilder extends TailwindDefaultBuilder {
    constructor(node, showLayerName, optIsJSX) {
        super(node, showLayerName, optIsJSX);
    }
    // must be called before Position method
    textAutoSize(node) {
        if (node.textAutoResize === 'NONE') {
            // going to be used for position
            this.hasFixedSize = true;
        }
        this.widthHeight(node);
        return this;
    }
    // todo fontFamily
    //  fontFamily(node: AltTextNode): this {
    //    return this;
    //  }
    /**
     * https://tailwindcss.com/docs/font-size/
     * example: text-md
     */
    fontSize(node) {
        // example: text-md
        if (node.fontSize !== figma.mixed) {
            const value = pxToFontSize(node.fontSize);
            this.attributes += `text-${value} `;
        }
        return this;
    }
    /**
     * https://tailwindcss.com/docs/font-style/
     * example: font-extrabold
     * example: italic
     */
    fontStyle(node) {
        if (node.fontName !== figma.mixed) {
            const lowercaseStyle = node.fontName.style.toLowerCase();
            if (lowercaseStyle.match('italic')) {
                this.attributes += 'italic ';
            }
            if (lowercaseStyle.match('regular')) {
                // ignore the font-style when regular (default)
                return this;
            }
            const value = node.fontName.style
                .replace('italic', '')
                .replace(' ', '')
                .toLowerCase();
            this.attributes += `font-${value} `;
        }
        return this;
    }
    /**
     * https://tailwindcss.com/docs/letter-spacing/
     * example: tracking-widest
     */
    letterSpacing(node) {
        const letterSpacing = commonLetterSpacing(node);
        if (letterSpacing > 0) {
            const value = pxToLetterSpacing(letterSpacing);
            this.attributes += `tracking-${value} `;
        }
        return this;
    }
    /**
     * https://tailwindcss.com/docs/line-height/
     * example: leading-3
     */
    lineHeight(node) {
        const lineHeight = commonLineHeight(node);
        if (lineHeight > 0) {
            const value = pxToLineHeight(lineHeight);
            this.attributes += `leading-${value} `;
        }
        return this;
    }
    /**
     * https://tailwindcss.com/docs/text-align/
     * example: text-justify
     */
    textAlign(node) {
        // if alignHorizontal is LEFT, don't do anything because that is native
        // only undefined in testing
        if (node.textAlignHorizontal && node.textAlignHorizontal !== 'LEFT') {
            // todo when node.textAutoResize === "WIDTH_AND_HEIGHT" and there is no \n in the text, this can be ignored.
            switch (node.textAlignHorizontal) {
                case 'CENTER':
                    this.attributes += `text-center `;
                    break;
                case 'RIGHT':
                    this.attributes += `text-right `;
                    break;
                case 'JUSTIFIED':
                    this.attributes += `text-justify `;
                    break;
            }
        }
        return this;
    }
    /**
     * https://tailwindcss.com/docs/text-transform/
     * example: uppercase
     */
    textTransform(node) {
        if (node.textCase === 'LOWER') {
            this.attributes += 'lowercase ';
        }
        else if (node.textCase === 'TITLE') {
            this.attributes += 'capitalize ';
        }
        else if (node.textCase === 'UPPER') {
            this.attributes += 'uppercase ';
        }
        else if (node.textCase === 'ORIGINAL') ;
        return this;
    }
    /**
     * https://tailwindcss.com/docs/text-decoration/
     * example: underline
     */
    textDecoration(node) {
        if (node.textDecoration === 'UNDERLINE') {
            this.attributes += 'underline ';
        }
        else if (node.textDecoration === 'STRIKETHROUGH') {
            this.attributes += 'line-through ';
        }
        return this;
    }
    reset() {
        this.attributes = '';
    }
}

// From https://github.com/sindresorhus/indent-string
const indentString = (str, indentLevel = 1) => {
    // const options = {
    //   includeEmptyLines: false,
    // };
    // const regex = options.includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;
    const regex = /^(?!\s*$)/gm;
    return str.replace(regex, ' '.repeat(indentLevel * 4));
};

// https://stackoverflow.com/a/20762713
const mostFrequent = (arr) => {
    return arr
        .sort((a, b) => arr.filter((v) => v === a).length - arr.filter((v) => v === b).length)
        .pop();
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

const convertSingleNodeToAlt = (node, parent = null) => {
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

let parentId$1 = '';
let showLayerName = false;
let scriptSet = new Set();
const tailwindMain = (sceneNode, parentIdSrc = '', isJsx = false, layerName = false) => {
    scriptSet = new Set();
    parentId$1 = parentIdSrc;
    showLayerName = layerName;
    let result = tailwindWidgetGenerator(sceneNode, isJsx);
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
const tailwindWidgetGenerator = (sceneNode, isJsx) => {
    let comp = '';
    // filter non visible nodes. This is necessary at this step because conversion already happened.
    const visibleSceneNode = sceneNode.filter((d) => d.visible !== false);
    visibleSceneNode.forEach((node) => {
        if (node.type === 'RECTANGLE' || node.type === 'ELLIPSE') {
            comp += tailwindContainer(node, '', '', { isRelative: false, isInput: false }, isJsx);
        }
        else if (node.type === 'GROUP') {
            comp += tailwindGroup(node, isJsx);
        }
        else if (node.type === 'FRAME') {
            comp += tailwindFrame(node, isJsx);
        }
        else if (node.type === 'TEXT') {
            comp += tailwindText(node, false, isJsx);
        }
        else if (node.type === 'COMPONENT') {
            comp += tailwindComponent();
        }
        else if (node.type === 'INSTANCE') {
            comp += tailwindInstance(node);
        }
        // todo support Line
    });
    return comp;
};
const tailwindGroup = (node, isJsx = false) => {
    // ignore the view when size is zero or less
    // while technically it shouldn't get less than 0, due to rounding errors,
    // it can get to values like: -0.000004196293048153166
    // also ignore if there are no children inside, which makes no sense
    if (node.width <= 0 || node.height <= 0 || node.children.length === 0) {
        return '';
    }
    // this needs to be called after CustomNode because widthHeight depends on it
    const builder = new TailwindDefaultBuilder(node, showLayerName, isJsx)
        .blend(node)
        .widthHeight(node)
        .position(node, parentId$1);
    if (builder.attributes || builder.style) {
        const attr = builder.build('relative ');
        const generator = tailwindWidgetGenerator(node.children, isJsx);
        return `\n<div${attr}>${indentString(generator)}\n</div>`;
    }
    return tailwindWidgetGenerator(node.children, isJsx);
};
const tailwindText = (node, isInput, isJsx) => {
    // follow the website order, to make it easier
    const builderResult = new TailwindTextBuilder(node, showLayerName, isJsx)
        .blend(node)
        .textAutoSize(node)
        .position(node, parentId$1)
        // todo fontFamily (via node.fontName !== figma.mixed ? `fontFamily: ${node.fontName.family}`)
        // todo font smoothing
        .fontSize(node)
        .fontStyle(node)
        .letterSpacing(node)
        .lineHeight(node)
        .textDecoration(node)
        // todo text lists (<li>)
        .textAlign(node)
        .customColor(node.fills, 'text')
        .textTransform(node);
    const splittedChars = node.characters.split('\n');
    const charsWithLineBreak = splittedChars.length > 1
        ? node.characters.split('\n').join('<br/>')
        : node.characters;
    if (isInput) {
        return [builderResult.attributes, charsWithLineBreak];
    }
    else {
        return `\n<p${builderResult.build()}>${charsWithLineBreak}</p>`;
    }
};
const tailwindComponent = (node) => {
    return `\n<Keypad on:submit={handleSubmit} {maxLength} focusSectionOption={{ id: 'Keypad' }} />`;
};
const tailwindInstance = (node) => {
    const tag = node.mainComponent.name;
    if (!tag) {
        return '';
    }
    let attr = '';
    switch (tag) {
        case 'Keypad':
            attr = `on:submit={handleSubmit} {maxLength} focusSectionOption={{ id: 'Keypad' }}`;
            break;
        case 'Button':
            scriptSet.add('Button');
            let option = '';
            console.log('🇻🇳 ~ file: tailwindMain.ts ~ line 189 ~ node', node);
            if (node.interactions[0]) {
                const { action, trigger } = node.interactions[0];
                // const TRIGGER_MAP: Record<STrigger['type'], string> = {
                // 	ON_CLICK: 'on:click',
                // 	AFTER_TIMEOUT: '',
                // 	MOUSE_DOWN: '',
                // 	MOUSE_ENTER: '',
                // 	MOUSE_LEAVE: '',
                // 	MOUSE_UP: '',
                // 	ON_DRAG: '',
                // 	ON_HOVER: '',
                // 	ON_PRESS: '',
                // }
                // const build = builder.build(additionalAttr)
                option = action.type === 'SELECT' ? `${action.option}` : ``;
            }
            attr = `selection={'${option}'}`;
    }
    const childrenStr = tailwindWidgetGenerator(node.children, false);
    // ignore the view when size is zero or less
    // while technically it shouldn't get less than 0, due to rounding errors,
    // it can get to values like: -0.000004196293048153166
    if (node.width <= 0 || node.height <= 0) {
        return childrenStr;
    }
    let isRelative = true;
    let additionalAttr = 'relative ';
    if (node.layoutMode !== 'NONE') {
        additionalAttr = rowColumnProps(node);
        isRelative = false;
    }
    const builder = new TailwindDefaultBuilder(node, showLayerName, false)
        .blend(node)
        .widthHeight(node)
        .autoLayoutPadding(node)
        .position(node, parentId$1, isRelative)
        .customColor(node.fills, 'bg')
        // TODO image and gradient support (tailwind does not support gradients)
        .shadow(node)
        .border(node);
    return `\n<${tag} ${attr} ${builder.build(additionalAttr)} >${indentString(childrenStr)}\n</${tag}>`;
};
const tailwindFrame = (node, isJsx) => {
    // const vectorIfExists = tailwindVector(node, isJsx);
    // if (vectorIfExists) return vectorIfExists;
    var _a;
    if (node.children.length === 1 &&
        node.children[0].type === 'TEXT' &&
        ((_a = node === null || node === void 0 ? void 0 : node.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().match('input'))) {
        const [attr, char] = tailwindText(node.children[0], true, isJsx);
        return tailwindContainer(node, ` placeholder="${char}"`, attr, { isRelative: false, isInput: true }, isJsx);
    }
    const childrenStr = tailwindWidgetGenerator(node.children, isJsx);
    if (node.layoutMode !== 'NONE') {
        const rowColumn = rowColumnProps(node);
        return tailwindContainer(node, childrenStr, rowColumn, { isRelative: false, isInput: false }, isJsx);
    }
    else {
        // node.layoutMode === "NONE" && node.children.length > 1
        // children needs to be absolute
        return tailwindContainer(node, childrenStr, 'relative ', { isRelative: true, isInput: false }, isJsx);
    }
};
// properties named propSomething always take care of ","
// sometimes a property might not exist, so it doesn't add ","
const tailwindContainer = (node, children, additionalAttr, attr, isJsx) => {
    var _a;
    // ignore the view when size is zero or less
    // while technically it shouldn't get less than 0, due to rounding errors,
    // it can get to values like: -0.000004196293048153166
    if (node.width <= 0 || node.height <= 0) {
        return children;
    }
    const builder = new TailwindDefaultBuilder(node, showLayerName, isJsx)
        .blend(node)
        .widthHeight(node)
        .autoLayoutPadding(node)
        .position(node, parentId$1, attr.isRelative)
        .customColor(node.fills, 'bg')
        // TODO image and gradient support (tailwind does not support gradients)
        .shadow(node)
        .border(node);
    if (attr.isInput) {
        // children before the > is not a typo.
        return `\n<input${builder.build(additionalAttr)}${children}></input>`;
    }
    if (builder.attributes || additionalAttr) {
        const build = builder.build(additionalAttr);
        // image fill and no children -- let's emit an <img />
        let tag = 'div';
        let src = '';
        if (((_a = retrieveTopFill(node.fills)) === null || _a === void 0 ? void 0 : _a.type) === 'IMAGE') {
            tag = 'img';
            src = ` src="https://via.placeholder.com/${node.width}x${node.height}"`;
        }
        let focusSection = '';
        if (node.focusSection) {
            scriptSet.add('focusSection');
            focusSection = ` use:focusSection={${JSON.stringify(node.focusSection)}} `;
        }
        if (children) {
            return `\n<${tag}${focusSection}${build}${src} >${indentString(children)}\n</${tag}>`;
        }
        else {
            return `\n<${tag}${focusSection}${build}${src} />`;
        }
    }
    return children;
};
const rowColumnProps = (node) => {
    // ROW or COLUMN
    // ignore current node when it has only one child and it has the same size
    if (node.children.length === 1 &&
        node.children[0].width === node.width &&
        node.children[0].height === node.height) {
        return '';
    }
    // [optimization]
    // flex, by default, has flex-row. Therefore, it can be omitted.
    const rowOrColumn = node.layoutMode === 'HORIZONTAL' ? '' : 'flex-col ';
    // https://tailwindcss.com/docs/space/
    // space between items
    const spacing = node.itemSpacing > 0 ? pxToLayoutSize(node.itemSpacing) : 0;
    const spaceDirection = node.layoutMode === 'HORIZONTAL' ? 'x' : 'y';
    // space is visually ignored when there is only one child or spacing is zero
    const space = node.children.length > 1 && spacing > 0
        ? `space-${spaceDirection}-${spacing} `
        : '';
    // special case when there is only one children; need to position correctly in Flex.
    // let justify = "justify-center";
    // if (node.children.length === 1) {
    //   const nodeCenteredPosX = node.children[0].x + node.children[0].width / 2;
    //   const parentCenteredPosX = node.width / 2;
    //   const marginX = nodeCenteredPosX - parentCenteredPosX;
    //   // allow a small threshold
    //   if (marginX < -4) {
    //     justify = "justify-start";
    //   } else if (marginX > 4) {
    //     justify = "justify-end";
    //   }
    // }
    let primaryAlign;
    switch (node.primaryAxisAlignItems) {
        case 'MIN':
            primaryAlign = 'justify-start ';
            break;
        case 'CENTER':
            primaryAlign = 'justify-center ';
            break;
        case 'MAX':
            primaryAlign = 'justify-end ';
            break;
        case 'SPACE_BETWEEN':
            primaryAlign = 'justify-between ';
            break;
    }
    // [optimization]
    // when all children are STRETCH and layout is Vertical, align won't matter. Otherwise, center it.
    let counterAlign;
    switch (node.counterAxisAlignItems) {
        case 'MIN':
            counterAlign = 'items-start ';
            break;
        case 'CENTER':
            counterAlign = 'items-center ';
            break;
        case 'MAX':
            counterAlign = 'items-end ';
            break;
    }
    // const layoutAlign =
    //   node.layoutMode === "VERTICAL" &&
    //   node.children.every((d) => d.layoutAlign === "STRETCH")
    //     ? ""
    //     : `items-center ${justify} `;
    // if parent is a Frame with AutoLayout set to Vertical, the current node should expand
    const flex = node.parent &&
        'layoutMode' in node.parent &&
        node.parent.layoutMode === node.layoutMode
        ? 'flex '
        : 'inline-flex ';
    return `${flex}${rowOrColumn}${space}${counterAlign}${primaryAlign}`;
};

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
let isJsx = false;
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
        result = tailwindMain(convertedSelection, parentId, isJsx, layerName);
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
    const isSingleSelection = selection.length === 1;
    if (isSingleSelection) {
        //  Can use convertIntoSNodes to achieved better node structure
        let node = convertSingleNodeToAlt(selection[0], null);
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
on('jsx', (args) => {
    if (args.data !== isJsx) {
        isJsx = args.data;
        run();
    }
});
on('layerName', (args) => {
    if (args.data !== layerName) {
        layerName = args.data;
        run();
    }
});
