import {
	DottedName,
	encodeRuleNameToSearchParam,
} from '@/components/publicodesUtils'

export function isFluidLayout(encodedPathname: string): boolean {
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
	if (focusedCategory === null) {
		return new URLSearchParams()
	}
	return new URLSearchParams({ catégorie: focusedCategory })
}

export function getQuestionURLSearchParams(
	ruleName: DottedName
): URLSearchParams {
	const encodedRuleName = encodeRuleNameToSearchParam(ruleName)

	if (encodedRuleName === undefined) {
		return new URLSearchParams()
	}

	return new URLSearchParams({ question: encodedRuleName })
}
