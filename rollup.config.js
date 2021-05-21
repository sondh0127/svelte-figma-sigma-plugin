import svelte from 'rollup-plugin-svelte'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import sveltePreprocess from 'svelte-preprocess'
import typescript from '@rollup/plugin-typescript'
import css from 'rollup-plugin-css-only'
import html from 'rollup-plugin-bundle-html-thomzz'
import svg from 'rollup-plugin-svg'
import image from '@rollup/plugin-image'

const production = !process.env.ROLLUP_WATCH

function serve() {
	let server

	function toExit() {
		if (server) server.kill(0)
	}

	return {
		writeBundle() {
			if (server) return
			server = require('child_process').spawn(
				'npm',
				['run', 'start', '--', '--dev'],
				{
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true,
				},
			)

			process.on('SIGTERM', toExit)
			process.on('exit', toExit)
		},
	}
}

export default [
	{
		input: 'src/main.ts',
		output: {
			// sourcemap: true,
			format: 'iife',
			name: 'app',
			file: 'public/build/bundle.js',
		},
		plugins: [
			svelte({
				preprocess: sveltePreprocess({
					// sourceMap: !production,
					// postcss: {
					// 	plugins: [cssnano()],
					// },
				}),
				compilerOptions: {
					// enable run-time checks when not in production
					dev: !production,
				},
			}),
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css({ output: 'bundle.css' }),

			// If you have external dependencies installed from
			// npm, you'll most likely need these plugins. In
			// some cases you'll need additional configuration -
			// consult the documentation for details:
			// https://github.com/rollup/plugins/tree/master/packages/commonjs
			resolve({
				browser: true,
				dedupe: ['svelte'],
			}),
			// svg(),
			commonjs(),
			svg(),
			image({ dom: true }),
			typescript({
				// sourceMap: !production,
				inlineSources: !production,
			}),
			html({
				template: 'src/template.html',
				// or html code: '<html><head></head><body></body></html>'
				dest: 'public/build',
				filename: 'index.html',
				// inject: 'head',
				// exclude: ['workers', 'externalSlowToBundleFile.js'],
				inline: true,
				minifyCss: production,
				// externals: [
				// 	{ type: 'js', file: 'file1.js', pos: 'before' },
				// 	{ type: 'js', file: 'file2.js', pos: 'before' },
				// ],
			}),
			// In dev mode, call `npm run start` once
			// the bundle has been generated
			!production && serve(),

			// Watch the `public` directory and refresh the
			// browser on changes when not in production
			!production && livereload('public'),

			// If we're building for production (npm run build
			// instead of npm run dev), minify
			production && terser(),
		],
		watch: {
			clearScreen: false,
		},
	},
	{
		input: 'src/code.ts',
		output: {
			file: 'public/code.js',
			format: 'cjs',
			name: 'code',
		},
		plugins: [typescript(), commonjs(), production && terser()],
	},
]
