export const isFluidLayout = (encodedPathname) => {
	const pathname = decodeURIComponent(encodedPathname)

	return (
		pathname === '/' ||
		pathname.startsWith('/nouveautés') ||
		pathname.startsWith('/documentation') ||
		pathname.startsWith('/international')
	)
}

export function getFocusedCategoryURLParams(
	focusedCategory: string | null
): string {
	const params = focusedCategory ? `?catégorie=${focusedCategory}` : ''
	return params
}
