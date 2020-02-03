/**
 * The component for appending prev/next arrows.
 *
 * @author    Naotoshi Fujita
 * @copyright Naotoshi Fujita. All rights reserved.
 */

import { create, append, before, domify, remove, removeAttribute } from '../../utils/dom';
import { XML_NAME_SPACE, PATH, SIZE } from './path';


/**
 * The component for appending prev/next arrows.
 *
 * @param {Splide} Splide     - A Splide instance.
 * @param {Object} Components - An object containing components.
 * @param {string} name       - A component name as a lowercase string.
 *
 * @return {Object} - The component object.
 */
export default ( Splide, Components, name ) => {
	/**
	 * Previous arrow element.
	 *
	 * @type {Element|undefined}
	 */
	let prev;

	/**
	 * Next arrow element.
	 *
	 * @type {Element|undefined}
	 */
	let next;

	/**
	 * Store the class list.
	 *
	 * @type {Object}
	 */
	const classes = Splide.classes;

	/**
	 * Hold the root element.
	 *
	 * @type {Element}
	 */
	const root = Splide.root;

	/**
	 * Whether arrows are created programmatically or not.
	 *
	 * @type {boolean}
	 */
	let created;

	/**
	 * Arrows component object.
	 *
	 * @type {Object}
	 */
	const Arrows = {
		/**
		 * Required when the arrows option is true.
		 *
		 * @type {boolean}
		 */
		required: Splide.options.arrows,

		/**
		 * Called when the component is mounted.
		 */
		mount() {
			const Elements = Components.Elements;

			// Attempt to get arrows from HTML source.
			prev = Elements.arrows.prev;
			next = Elements.arrows.next;

			// If arrows were not found in HTML, let's generate them.
			if ( ( ! prev || ! next ) && Splide.options.arrows ) {
				prev = createArrow( true );
				next = createArrow( false );
				created = true;

				appendArrows();
			}

			if ( prev && next ) {
				bind();
			}

			this.arrows = { prev, next };
		},

		/**
		 * Called after all components are mounted.
		 */
		mounted() {
			Splide.emit( `${ name }:mounted`, prev, next );
		},

		/**
		 * Destroy.
		 */
		destroy() {
			[ prev, next ].forEach( elm => { removeAttribute( elm, 'disabled' ) } );

			if ( created ) {
				remove( prev.parentElement );
			}
		},
	};

	/**
	 * Listen native and custom events.
	 */
	function bind() {
		Splide
			.on( 'click', () => onClick( true ), prev )
			.on( 'click', () => onClick( false ), next )
			.on( 'mounted move updated', updateDisabled );
	}

	/**
	 * Called when an arrow is clicked.
	 *
	 * @param {boolean} prev - If true, the previous arrow is clicked.
	 */
	function onClick( prev ) {
		const perMove = Splide.options.perMove;
		Splide.go( perMove ? `${ prev ? '-' : '+' }${ perMove }` : ( prev ? '<' : '>' ) );
	}

	/**
	 * Update a disabled attribute.
	 */
	function updateDisabled() {
		const { prevIndex, nextIndex } = Components.Controller;
		const isEnough = Splide.length > Splide.options.perPage;

		prev.disabled = prevIndex < 0 || ! isEnough;
		next.disabled = nextIndex < 0 || ! isEnough;

		Splide.emit( `${ name }:updated`, prev, next, prevIndex, nextIndex );
	}

	/**
	 * Create a wrapper element and append arrows.
	 */
	function appendArrows() {
		const wrapper = create( 'div', { class: classes.arrows } );

		append( wrapper, prev );
		append( wrapper, next );

		const slider = Components.Elements.slider;
		const parent = Splide.options.arrows === 'slider' && slider ? slider : root;

		before( wrapper, parent.firstElementChild );
	}

	/**
	 * Create an arrow element.
	 *
	 * @param {boolean} prev - Determine to create a prev arrow or next arrow.
	 *
	 * @return {Element} - A created arrow element.
	 */
	function createArrow( prev ) {
		const arrow = `<button class="${ classes.arrow } ${ prev ? classes.prev : classes.next }">`
			+	`<svg xmlns="${ XML_NAME_SPACE }"	viewBox="0 0 ${ SIZE } ${ SIZE }"	width="${ SIZE }"	height="${ SIZE }">`
			+ `<path d="${ Splide.options.arrowPath || PATH }" />`;

		return domify( arrow );
	}

	return Arrows;
}