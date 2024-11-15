import { CHECK_SVG, MINUS_ERROR_SVG, INFO_SVG, TRIANGLE_SVG } from '$lib/config/constants';
import { writable } from 'svelte/store';

/**
 * @typedef {import('svelte').ComponentType} SvelteComponent
 */

/**
 * @typedef {import('svelte/types/runtime/transition/index').FlyParams} FlyParams
 */

/**
 * @typedef {Object} SvelteToastCustomComponent
 * @property {SvelteComponent} src - custom Svelte Component
 * @property {Object<string,any>} [props] - props to pass into custom component
 * @property {string} [sendIdTo] - forward toast id to prop name
 */

/**
 * @callback SvelteToastOnPopCallback
 * @param {number} [id] - optionally get the toast id if needed
 */

/**
 * @typedef {Object} SvelteToastOptions
 * @property {number} [id] - unique id generated for every toast
 * @property {string} [target] - container target name to send toast to
 * @property {string} [msg] - toast message
 * @property {number} [duration] - duration of progress bar tween from initial to next
 * @property {number} [initial] - initial progress bar value
 * @property {number} [next] - next progress bar value
 * @property {boolean} [pausable] - pause progress bar tween on mouse hover
 * @property {boolean} [dismissable] - allow dissmiss with close button
 * @property {boolean} [reversed] - display toasts in reverse order
 * @property {FlyParams} [intro] - toast intro fly animation settings
 * @property {Object<string,string|number>} [theme] - css var overrides
 * @property {string[]} [classes] - user-defined classes
 * @property {SvelteToastOnPopCallback} [onpop] - callback that runs on toast dismiss
 * @property {SvelteToastCustomComponent} [component] - send custom Svelte Component as a message
 */

/** @type {SvelteToastOptions} */
const defaults = {
	duration: 10000,
	initial: 1,
	classes: ['border-l-[3px]'],
	next: 0,
	pausable: true,
	dismissable: true,
	reversed: false,
	intro: { x: 256 }
};

function createToast() {
	const { subscribe, update } = writable([]);
	/** @type {Object<string,SvelteToastOptions>} */
	const options = {};
	let count = 0;

	/** @param {any} obj */
	function _obj(obj) {
		return obj instanceof Object;
	}

	function _init(target = 'default', opts = {}) {
		options[target] = opts;
		return options;
	}

	/**
	 * Send a new toast
	 * @param {(string|SvelteToastOptions)} msg
	 * @param {SvelteToastOptions} [opts]
	 * @returns {number}
	 */
	function push(msg, opts) {
		const param = {
			target: 'default',
			...(_obj(msg) ? /** @type {SvelteToastOptions} */ (msg) : { ...opts, msg })
		};
		const conf = options[param.target] || {};
		const entry = {
			...defaults,
			...conf,
			...param,
			theme: { ...conf.theme, ...param.theme },
			classes: [...(conf.classes || []), ...(param.classes || [])]
		};
		count++;
		entry.id = count;
		update((n) => (entry.reversed ? [...n, entry] : [entry, ...n]));
		return count;
	}

	function success(m, testId = '') {
		pop();
		push(
			`<div class="flex items-center">
				<svg viewBox="0 0 512 512" width="17" height="17" style="min-width: 17px; min-height: 17px;" fill="#008540">
					<path d="${CHECK_SVG}"/>
				</svg>
				<div style="padding-left: 0.5rem" ${testId !== '' ? `data-cy-id=${testId}` : ''}>
					${m}
				</div>
			</div>`,
			{
				theme: {
					'--toastBackground': '#f2f9f5',
					'--toastBorder': '1px solid #00854066',
					'--toastLeftBorderColor': '#008540'
				}
			}
		);
	}

	function info(m, testId = '') {
		pop();
		push(
			`<div class="flex items-center">
				<svg viewBox="0 0 512 512" width="17" height="17" style="min-width: 17px; min-height: 17px;" fill="#1a7ead">
					<path d="${INFO_SVG}"/>
				</svg>
				<div style="padding-left: 0.5rem" ${testId !== '' ? `data-cy-id=${testId}` : ''}>
					${m}
				</div>
			</div>`,
			{
				theme: {
					'--toastBackground': '#F4F9FB',
					'--toastBorder': '1px solid #1a7ead66',
					'--toastLeftBorderColor': '#1a7ead'
				}
			}
		);
	}

	function warning(m, testId = '') {
		pop();
		push(
			`<div class="flex items-center">
				<svg viewBox="0 0 574 512" width="17" height="17" style="min-width: 17px; min-height: 17px;" fill="#f7a827">
					<path d="${TRIANGLE_SVG}"/>
				</svg>
				<div style="padding-left: 0.5rem" ${testId !== '' ? `data-cy-id=${testId}` : ''}>
					${m}
				</div>
			</div>`,
			{
				theme: {
					'--toastBackground': '#fffbf4',
					'--toastBorder': '1px solid #f7a82766',
					'--toastLeftBorderColor': '#f7a827'
				}
			}
		);
	}

	function failure(m, testId = '') {
		pop();
		push(
			`<div class="flex items-center">
				<svg viewBox="0 0 512 512" width="17" height="17" style="min-width: 17px; min-height: 17px;" fill="#c60000">
					<path d="${MINUS_ERROR_SVG}"/>
				</svg>
				<div style="padding-left: 0.5rem" ${testId !== '' ? `data-cy-id=${testId}` : ''}>
					${m}
				</div>
			</div>`,
			{
				theme: {
					'--toastBackground': '#fcf2f2',
					'--toastBorder': '1px solid #c6000066',
					'--toastLeftBorderColor': '#c60000'
				}
			}
		);
	}

	/**
	 * Remove toast(s)
	 * - toast.pop() // removes the last toast
	 * - toast.pop(0) // remove all toasts
	 * - toast.pop(id) // removes the toast with specified `id`
	 * - toast.pop({ target: 'foo' }) // remove all toasts from target `foo`
	 * @param {(number|Object<'target',string>)} [id]
	 */
	function pop(id) {
		update((n) => {
			if (!n.length || id === 0) {
				return [];
			}
			// Filter function is deprecated; shim added for backward compatibility
			if (typeof id === 'function') {
				return n.filter((i) => id(i));
			}
			if (_obj(id)) {
				return n.filter(/** @type {SvelteToastOptions[]} i */ (i) => i.target !== id.target);
			}
			const found = id || Math.max(...n.map((i) => i.id));
			return n.filter((i) => i.id !== found);
		});
	}

	/**
	 * Update an existing toast
	 * @param {(number|SvelteToastOptions)} id
	 * @param {SvelteToastOptions} [opts]
	 */
	function set(id, opts) {
		/** @type {any} */
		const param = _obj(id) ? id : { ...opts, id };
		update((n) => {
			const idx = n.findIndex((i) => i.id === param.id);
			if (idx > -1) {
				n[idx] = { ...n[idx], ...param };
			}
			return n;
		});
	}

	return { subscribe, push, pop, set, _init, success, info, failure, warning };
}

export const toast = createToast();
