import { utils } from 'publicodes'
import { DottedName } from '../../components/publicodesUtils'

export const isFluidLayout = (encodedPathname) => {
	const pathname = decodeURIComponent(encodedPathname)

	return (
		pathname === '/' ||
		pathname.startsWith('/nouveautés') ||
		pathname.startsWith('/documentation') ||
		pathname.startsWith('/international')
	)
}

export function getFocusedCategoryURLSearchParams(
	focusedCategory: string | null
): URLSearchParams {
	return new URLSearchParams(
		focusedCategory != undefined
			? {
					catégorie: focusedCategory,
			  }
			: {}
	)
}

export function getQuestionURLSearchParams(
	ruleName: DottedName
): URLSearchParams {
	return new URLSearchParams({
		question: utils.encodeRuleName(ruleName),
	})
}
