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
