import { Category, DottedName } from '@/components/publicodesUtils'
import { sortBy } from '@/utils'

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
