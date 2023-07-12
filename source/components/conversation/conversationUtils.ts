import {
	Category,
	DottedName,
	encodeRuleNameToSearchParam,
	isValidQuestion,
	NGCRulesNodes,
} from '@/components/publicodesUtils'
import { getFocusedCategoryURLSearchParams } from '@/sites/publicodes/utils'
import { sortBy } from '@/utils'
import { utils } from 'publicodes'

export function sortQuestionsByCategory(
	nextQuestions: DottedName[],
	orderByCategories: Category[]
): DottedName[] {
	const sort = sortBy((question: string | string[]) => {
		const category = orderByCategories.find(
			(c) => question.indexOf(c.dottedName) === 0
		)
		if (!category) {
			return 1000000
		}
		// We artificially put this category (since it has no actionable question) at the end
		if (category.name === 'services sociétaux') {
			return 100000
		}
		return -(category?.nodeValue ?? 0)
	})
	return sort(nextQuestions)
}

export function getPreviousQuestion(
	currentQuestionIndex: number,
	previousAnswers: DottedName[],
	isMosaic: boolean,
	questionsToSubmit: (DottedName | null)[] | undefined
): DottedName | undefined {
	const currentIsNew = currentQuestionIndex < 0

	if (currentIsNew && previousAnswers.length > 0) {
		return previousAnswers[previousAnswers.length - 1]
	}

	if (isMosaic) {
		const res = [...previousAnswers].reverse().find((el, index) => {
			const currentQuestionReversedIndex =
				previousAnswers.length - currentQuestionIndex
			return (
				index > currentQuestionReversedIndex &&
				// The previous question shouldn't be one of the current mosaic's questions
				!questionsToSubmit?.includes(el)
			)
		})
		return res
	}

	// We'll explore the previous answers starting from the end,
	// to find the first question that is not in the current mosaic
	return previousAnswers[currentQuestionIndex - 1]
}

export function getMosaicParentRuleName(
	rules: NGCRulesNodes,
	ruleName: DottedName
): DottedName {
	let parentRuleName = ruleName

	do {
		parentRuleName = utils.ruleParent(parentRuleName)
	} while (parentRuleName != '' && !isValidQuestion(parentRuleName, rules))

	return parentRuleName
}

export function updateCurrentURL({
	paramName,
	paramValue,
	simulateurRootRuleURL,
	focusedCategory,
}: {
	paramName: string
	paramValue?: string | undefined
	simulateurRootRuleURL: string
	focusedCategory: string | null
}): void {
	const searchParams = getFocusedCategoryURLSearchParams(focusedCategory)
	if (paramValue != undefined) {
		searchParams.append(
			paramName,
			encodeRuleNameToSearchParam(paramValue) ?? ''
		)
	}

	window.history.replaceState(
		{},
		'',
		`/simulateur/${simulateurRootRuleURL}?${searchParams}`
	)
}

export function focusByCategory(
	questions: DottedName[],
	focusedCategory: string | null
) {
	if (!focusedCategory) {
		return questions
	}
	const filtered = questions.filter((q) => q.startsWith(focusedCategory))
	//this is important : if all questions of a focus have been answered
	// then don't triggered the end screen, just ask the other questions
	// as if no focus
	if (!filtered.length) {
		return questions
	}
	return filtered
}
