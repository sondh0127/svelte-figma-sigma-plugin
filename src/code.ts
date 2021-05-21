// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).
let parentId: string
let isJsx = false
let layerName = false
let material = true

let mode: 'flutter' | 'swiftui' | 'html' | 'tailwind'
// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 450, height: 550 })

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => {
	// One way of distinguishing between different types of messages sent from
	// your HTML page is to use an object with a "type" property like this.
	if (msg.type === 'create-shapes') {
		const nodes: SceneNode[] = []

		for (let i = 0; i < msg.count; i++) {
			var shape

			if (msg.shape === 'rectangle') {
				shape = figma.createRectangle()
			} else if (msg.shape === 'triangle') {
				shape = figma.createPolygon()
			} else if (msg.shape === 'line') {
				shape = figma.createLine()
			} else {
				shape = figma.createEllipse()
			}

			shape.x = i * 150
			shape.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }]
			figma.currentPage.appendChild(shape)
			nodes.push(shape)
		}

		figma.currentPage.selection = nodes
		figma.viewport.scrollAndZoomIntoView(nodes)
	}

	if (msg.type === 'info') {
		figma.currentPage.selection[0]
			.exportAsync({ format: 'PNG' })
			.then((result) => {
				console.log('🇻🇳 ~ file: code.ts ~ line 47 ~ result', result)
				figma.ui.postMessage({
					type: 'export-png',
					result: result,
				})
			})
	}

	// Make sure to close the plugin when you're done. Otherwise the plugin will
	// keep running, which shows the cancel button at the bottom of the screen.
	figma.closePlugin()
}
