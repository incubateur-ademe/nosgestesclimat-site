import { formatValue } from 'publicodes'
import { useLocation } from 'react-router'

export function capitalise0(name: undefined): undefined
export function capitalise0(name: string): string
export function capitalise0(name?: string) {
	return name && name[0].toUpperCase() + name.slice(1)
}

export const debounce = <F extends (...args: any[]) => void>(
	waitFor: number,
	fn: F
) => {
	let timeoutId: ReturnType<typeof setTimeout>
	return (...args: any[]) => {
		clearTimeout(timeoutId)
		timeoutId = setTimeout(() => fn(...args), waitFor)
	}
}

export const fetcher = (url: RequestInfo) => fetch(url).then((r) => r.json())

export function inIframe(): boolean {
	try {
		return window.self !== window.top
	} catch (e) {
		return true
	}
}

export function softCatch<ArgType, ReturnType>(
	fn: (arg: ArgType) => ReturnType
): (arg: ArgType) => ReturnType | null {
	return function (...args) {
		try {
			return fn(...args)
		} catch (e) {
			// eslint-disable-next-line no-console
			console.warn(e)
			return null
		}
	}
}

export function mapOrApply<A, B>(fn: (a: A) => B, x: A): B
export function mapOrApply<A, B>(fn: (a: A) => B, x: Array<A>): Array<B>
export function mapOrApply<A, B>(fn: (a: A) => B, x: A | Array<A>) {
	return Array.isArray(x) ? x.map(fn) : fn(x)
}

export function coerceArray<A>(x: A | Array<A>): Array<A> {
	return Array.isArray(x) ? x : [x]
}

export function getSessionStorage() {
	// In some browsers like Brave, even just reading the variable sessionStorage
	// is throwing an error in the iframe, so we can't do things if sessionStorage !== undefined
	// and we need to wrap it in a try { } catch { } logic
	try {
		return window.sessionStorage
	} catch (e) {
		return undefined
	}
}

export const currencyFormat = (language: string) => {
	const thousandSeparator = formatValue(1000, { language }).charAt(1)
	const decimalSeparator = formatValue(0.1, { language }).charAt(1)
	const notNumberOrValue = (val: string) =>
		'0' <= val && val <= '9' ? '' : val

	return {
		isCurrencyPrefixed: !!formatValue(12, {
			language,
			displayedUnit: '€',
		}).match(/^€/),
		thousandSeparator: notNumberOrValue(thousandSeparator),
		decimalSeparator: notNumberOrValue(decimalSeparator),
	}
}

export function hash(str: string): number {
	let hash = 0
	let chr
	for (let i = 0; i < str.length; i++) {
		chr = str.charCodeAt(i)
		hash = (hash << 5) - hash + chr
		hash |= 0 // Convert to 32bit integer
	}
	return hash
}

export const sortBy = (f) => (list) =>
	list.sort((a, b) => {
		const fa = f(a),
			fb = f(b)
		return fa < fb ? -1 : fa > fb ? 1 : 0
	})

export const last = (array) => {
	const [lastItem] = array.slice(-1)
	return lastItem
}

export function useQuery() {
	return new URLSearchParams(useLocation().search)
}

export function range(start, end) {
	return Array(end - start + 1)
		.fill()
		.map((_, idx) => start + idx)
}

export function omit(keys, obj) {
	if (!keys.length) return obj
	const { [keys.pop()]: omitted, ...rest } = obj
	return omit(keys, rest)
}

export const pipe =
	(...fns) =>
	(x) =>
		fns.reduce((v, f) => f(v), x)

export function arrayLoopIteration(array, key) {
	const index = array.indexOf(key)

	return index === array.length - 1 ? array[0] : array[index + 1]
}

export function isIterable<T>(obj: unknown): obj is Iterable<T> {
	return Symbol.iterator in Object(obj)
}

//https://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript
export function intersect(a, b) {
	var setB = new Set(b)
	return [...new Set(a)].filter((x) => setB.has(x))
}

export const pick = (obj, keys) =>
	Object.fromEntries(
		keys.filter((key) => key in obj).map((key) => [key, obj[key]])
	)

export const getIsIframe = () => window.self !== window.top
