import { Category } from '@/components/publicodesUtils'
import { assert } from '@/utils'
import { capitalise0 } from 'publicodes'

export type SmallCategoryInfos = {
	value: number
	labels: string[]
	categories: Category[]
}

export const groupTooSmallCategories = (
	categories: Category[],
	hideSmallerThanRatio = 0.1
) => {
	const total = categories
		// NOTE(@EmileRolley): undefined nodeValue will therefore be evaluated to 0
		.filter(({ nodeValue }) => nodeValue != undefined)
		.reduce((memo: number, { nodeValue }) => {
			assert(nodeValue != undefined)
			return memo + nodeValue
		}, 0)

	const rest = categories
		.filter((el) => el.nodeValue != undefined)
		.reduce(
			(memo: SmallCategoryInfos, next: Category) => {
				const { nodeValue, title } = next
				assert(nodeValue != undefined)

				const tooSmall = nodeValue < hideSmallerThanRatio * total

				return {
					value: tooSmall ? memo.value + nodeValue : memo.value,
					labels: tooSmall
						? [
								...memo.labels,
								`${getTitle(title)} [${Math.round(nodeValue)} kg]`,
						  ]
						: memo.labels,
					categories: tooSmall ? [...memo.categories, next] : memo.categories,
				}
			},
			{ value: 0, labels: [], categories: [] } as SmallCategoryInfos
		)
	const restWidth = (rest.value / total) * 100

	const bigEnough = categories.filter(
		({ nodeValue }) =>
			nodeValue != undefined && nodeValue / total > hideSmallerThanRatio
	)

	return { rest, bigEnough, total, restWidth }
}

export const getTitle = (title: string) => {
	const percentRegex = /^[0-9% ]*/
	const newTitle = title?.replace(percentRegex, '')
	return capitalise0(newTitle)
}
