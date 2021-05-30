export function clone(val) {
	const type = typeof val
	if (val === null) {
		return null
	} else if (
		type === 'undefined' ||
		type === 'number' ||
		type === 'string' ||
		type === 'boolean'
	) {
		return val
	} else if (type === 'object') {
		if (val instanceof Array) {
			return val.map((x) => clone(x))
		} else if (val instanceof Uint8Array) {
			return new Uint8Array(val)
		} else {
			let o = {}
			for (const key in val) {
				o[key] = clone(val[key])
			}
			return o
		}
	}
	throw 'unknown'
}

export async function encode(canvas, ctx, imageData) {
	ctx.putImageData(imageData, 0, 0)
	return await new Promise((resolve, reject) => {
		canvas.toBlob((blob) => {
			const reader = new FileReader()
			reader.onload = () => resolve(new Uint8Array(reader.result))
			reader.onerror = () => reject(new Error('Could not read from blob'))
			reader.readAsArrayBuffer(blob)
		})
	})
}

// Decoding an image can be done by sticking it in an HTML
// canvas, as we can read individual pixels off the canvas.
export async function decode(canvas, ctx, bytes) {
	const url = URL.createObjectURL(new Blob([bytes]))
	const image = await new Promise((resolve, reject) => {
		const img = new Image()
		img.onload = () => resolve(img)
		img.onerror = () => reject()
		img.src = url
	})
	canvas.width = image.width
	canvas.height = image.height
	ctx.drawImage(image, 0, 0)
	const imageData = ctx.getImageData(0, 0, image.width, image.height)
	return imageData
}

export const parseJSON = (opts, defaults) => {
	if (opts !== null && typeof opts === 'object') return opts
	defaults = defaults || null
	try {
		defaults = JSON.parse(opts)
	} catch (e) {
		console.log('Lỗi parse Json')
	}
	return defaults
}

export function notEmpty<TValue>(
	value: TValue | null | undefined,
): value is TValue {
	return value !== null && value !== undefined
}

const applyMatrixToPoint = (matrix: number[][], point: number[]): number[] => {
	return [
		point[0] * matrix[0][0] + point[1] * matrix[0][1] + matrix[0][2],
		point[0] * matrix[1][0] + point[1] * matrix[1][1] + matrix[1][2],
	]
}

/**
 *  this function return a bounding rect for an nodes
 */
// x/y absolute coordinates
// height/width
// x2/y2 bottom right coordinates
export const getBoundingRect = (
	node: LayoutMixin,
): {
	x: number
	y: number
	// x2: number;
	// y2: number;
	// height: number;
	// width: number;
} => {
	const boundingRect = {
		x: 0,
		y: 0,
		// x2: 0,
		// y2: 0,
		// height: 0,
		// width: 0,
	}

	const halfHeight = node.height / 2
	const halfWidth = node.width / 2

	const [[c0, s0, x], [s1, c1, y]] = node.absoluteTransform
	const matrix = [
		[c0, s0, x + halfWidth * c0 + halfHeight * s0],
		[s1, c1, y + halfWidth * s1 + halfHeight * c1],
	]

	// the coordinates of the corners of the rectangle
	const XY: {
		x: number[]
		y: number[]
	} = {
		x: [1, -1, 1, -1],
		y: [1, -1, -1, 1],
	}

	// fill in
	for (let i = 0; i <= 3; i++) {
		const a = applyMatrixToPoint(matrix, [
			XY.x[i] * halfWidth,
			XY.y[i] * halfHeight,
		])
		XY.x[i] = a[0]
		XY.y[i] = a[1]
	}

	XY.x.sort((a, b) => a - b)
	XY.y.sort((a, b) => a - b)

	return {
		x: XY.x[0],
		y: XY.y[0],
	}
}

// https://stackoverflow.com/a/20762713
export const mostFrequent = (arr: Array<string>): string | undefined => {
	return arr
		.sort(
			(a, b) =>
				arr.filter((v) => v === a).length - arr.filter((v) => v === b).length,
		)
		.pop()
}

export function toFixed(number, precision) {
	const multiplier = Math.pow(10, precision + 1)
	const wholeNumber = Math.floor(number * multiplier)
	return (Math.round(wholeNumber / 10) * 10) / multiplier
}

export function createRemFromPx(px): number {
	const pixels = parseFloat(px)
	if (pixels <= 1) return px

	return toFixed((pixels / 1920) * 120, 3)
}
