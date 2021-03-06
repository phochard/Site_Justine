/**
 * Some utility functions related with DOM.
 *
 * @author    Naotoshi Fujita
 * @copyright Naotoshi Fujita. All rights reserved.
 */

import { each, values } from './object';
import { toArray } from "./utils";


/**
 * Find the first element matching the given selector.
 * Be aware that all selectors after a space are ignored.
 *
 * @param {Element|Node}  elm       - An ancestor element.
 * @param {string}        selector  - DOMString.
 *
 * @return {Element|null} - A found element or null.
 */
export function find( elm, selector ) {
	return elm && selector ? elm.querySelector( selector.split( ' ' )[0] ) : null;
}

/**
 * Find a first child having the given class.
 *
 * @param {Element} parent    - A parent element.
 * @param {string}  className - A class name.
 *
 * @return {Element|null} - A found element on success. Null on failure.
 */
export function child( parent, className ) {
	if ( parent ) {
		return values( parent.children ).filter( child => {
			return hasClass( child, className.split( ' ' )[0] );
		} )[0] || null;
	}

	return null;
}

/**
 * Create an element with some optional attributes.
 *
 * @param {string} tag   - A tag name.
 * @param {Object} attrs - An object any attribute pairs of name and value.
 *
 * @return {Element} - A created element.
 */
export function create( tag, attrs ) {
	const elm = document.createElement( tag );
	each( attrs, ( value, key ) => setAttribute( elm, key, value ) );

	return elm;
}

/**
 * Convert HTML string to DOM node.
 *
 * @param {string} html - HTML string.
 *
 * @return {Node} - A created node.
 */
export function domify( html ) {
	const div = create( 'div', {} );
	div.innerHTML = html;

	return div.firstChild;
}

/**
 * Remove a given element from a DOM tree.
 *
 * @param {Element|Element[]} elms - Element(s) to be removed.
 */
export function remove( elms ) {
	toArray( elms ).forEach( elm => { elm && elm.parentElement.removeChild( elm ) } );
}

/**
 * Append a child to a given element.
 *
 * @param {Element} parent - A parent element.
 * @param {Element} child  - An element to be appended.
 */
export function append( parent, child ) {
	if ( parent ) {
		parent.appendChild( child );
	}
}

/**
 * Insert an element before the reference element.
 *
 * @param {Element|Node} ref - A reference element.
 * @param {Element}      elm - An element to be inserted.
 */
export function before( elm, ref ) {
	if ( elm && ref && ref.parentElement ) {
		ref.parentElement.insertBefore( elm, ref );
	}
}

/**
 * Apply styles to the given element.
 *
 * @param {Element} elm     - An element where styles are applied.
 * @param {Object}  styles  - Object containing styles.
 */
export function applyStyle( elm, styles ) {
	if ( elm ) {
		each( styles, ( value, prop ) => {
			elm.style[ prop ] = value || '';
		} );
	}
}

/**
 * Add or remove classes to/from the element.
 * This function is for internal usage.
 *
 * @param {Element}         elm     - An element where classes are added.
 * @param {string|string[]} classes - Class names being added.
 * @param {boolean}         remove  - Whether to remove or add classes.
 */
function addOrRemoveClasses( elm, classes, remove ) {
	if ( elm ) {
		toArray( classes ).forEach( name => {
			if ( name ) {
				elm.classList[ remove ? 'remove' : 'add' ]( name );
			}
		} );
	}
}

/**
 * Add classes to the element.
 *
 * @param {Element}          elm     - An element where classes are added.
 * @param {string|string[]}  classes - Class names being added.
 */
export function addClass( elm, classes ) {
	addOrRemoveClasses( elm, classes, false );
}

/**
 * Remove a class from the element.
 *
 * @param {Element}         elm     - An element where classes are removed.
 * @param {string|string[]} classes - A class name being removed.
 */
export function removeClass( elm, classes ) {
	addOrRemoveClasses( elm, classes, true );
}

/**
 * Verify if the provided element has the class or not.
 *
 * @param {Element} elm       - An element.
 * @param {string}  className - A class name.
 *
 * @return {boolean} - True if the element has the class or false if not.
 */
export function hasClass( elm, className ) {
	return !! elm && elm.classList.contains( className );
}

/**
 * Set attribute to the given element.
 *
 * @param {Element}                 elm   - An element where an attribute is assigned.
 * @param {string}                  name  - Attribute name.
 * @param {string|number|boolean}   value - Attribute value.
 */
export function setAttribute( elm, name, value ) {
	if ( elm ) {
		elm.setAttribute( name, value );
	}
}

/**
 * Get attribute from the given element.
 *
 * @param {Element} elm  - An element where an attribute is assigned.
 * @param {string}  name - Attribute name.
 *
 * @return {string|null} - The value of the given attribute if available. Null if not.
 */
export function getAttribute( elm, name ) {
	return elm ? elm.getAttribute( name ) : null;
}

/**
 * Remove attribute from the given element.
 *
 * @param {Element}      elm   - An element where an attribute is removed.
 * @param {string|Array} names - Attribute name.
 */
export function removeAttribute( elm, names ) {
	if ( elm ) {
		toArray( names ).forEach( name => { elm.removeAttribute( name ) } );
	}
}