import {
	Category,
	DottedName,
	encodeRuleNameToSearchParam,
	MODEL_ROOT_RULE_NAME,
} from '@/components/publicodesUtils'
import { sortBy } from '@/utils'
import { Dispatch } from 'react'
import { NavigateFunction } from 'react-router'
import { AnyAction } from 'redux'
import { goToQuestion } from '../../actions/actions'
import { getFocusedCategoryURLSearchParams } from '../../sites/publicodes/utils'

export function sortQuestionsByCategory(
	nextQuestions: DottedName[],
	orderByCategories: Category[]
): DottedName[] {
	let sort = sortBy((question: string | string[]) => {
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
	questionsToSubmit: DottedName[] | undefined
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

export function goToQuestionOrNavigate(
	question: DottedName,
	focusedCategory: string | null,
	toUse: { dispatch: Dispatch<AnyAction> } | { navigate: NavigateFunction }
): void {
	if (toUse['navigate'] != undefined) {
		let searchParams = getFocusedCategoryURLSearchParams(focusedCategory)
		searchParams.append('question', encodeRuleNameToSearchParam(question))

		toUse['navigate'](`/simulateur/${MODEL_ROOT_RULE_NAME}?${searchParams}`, {
			replace: true,
		})
	} else {
		toUse['dispatch'](goToQuestion(question))
	}
}

export function focusByCategory(
	questions: DottedName[],
	focusedCategory: string | null
) {
	if (!focusedCategory) {
		return questions
	}
	const filtered = questions.filter((q) => q.indexOf(focusedCategory) === 0)
	//this is important : if all questions of a focus have been answered
	// then don't triggered the end screen, just ask the other questions
	// as if no focus
	if (!filtered.length) {
		return questions
	}
	return filtered
}
