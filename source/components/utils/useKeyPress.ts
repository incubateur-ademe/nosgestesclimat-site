import { useEffect } from 'react'
/**
 * useKeyPress
 * @param {string} key - the name of the key to respond to, compared against event.key
 * @param {function} action - the action to perform on key press
 */
export default function useKeypress(
	key: string,
	control: boolean,
	action: Function,
	eventType: string = 'keyup',
	hookConditions
) {
	useEffect(() => {
		function onKeyup(e) {
			if (e.key === key && (!control || e.ctrlKey)) action(e)
		}
		window.addEventListener(eventType, onKeyup)
		return () => window.removeEventListener(eventType, onKeyup)
	}, hookConditions)
}
