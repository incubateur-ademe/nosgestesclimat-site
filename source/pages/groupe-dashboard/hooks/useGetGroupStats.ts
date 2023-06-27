import {
	DottedName,
	extractCategories,
	getSubcategories,
} from '@/components/publicodesUtils'
import { useEngine } from '@/components/utils/EngineContext'
import { Member } from '@/types/groups'
import Engine from 'publicodes'

type ValueObject = {
	value: number
	mean?: number
	variation?: number
	icon?: string
}

type Points = {
	key: string
	resultObject: ValueObject
}

export const useGetGroupStats = ({
	groupMembers,
	userId,
}: {
	groupMembers: Member[] | undefined
	userId: string | null
}) => {
	const engine: Engine<DottedName> = useEngine()

	const rules = engine.getParsedRules()

	if (!groupMembers || !userId) return null

	const results = {
		currentMember: {} as Record<string, ValueObject>,
		allMembers: {} as Record<string, ValueObject>,
		pointsForts: {} as Points[],
		pointsFaibles: {} as Points[],
	}

	const allMembersSummedFootprintsByCategoriesAndSubCategories =
		groupMembers.reduce((acc, groupMember: Member) => {
			const isCurrentMember = groupMember.userId === userId

			const updatedAcc = { ...acc }

			// Set Situation
			engine.setSituation(groupMember?.simulation?.situation)

			const categories = extractCategories(rules, engine)

			categories.forEach((category) => {
				// If the category is not in the accumulator, we add it along with its value
				// otherwise we add the value to the existing sum
				if (!updatedAcc[category.name]) {
					updatedAcc[category.name] = {
						value: category.nodeValue as number,
						icon: rules[category?.name]?.rawNode?.icônes,
					}
				} else {
					updatedAcc[category.name].value += category.nodeValue as number
				}

				// Add each category footprint for the current member
				if (isCurrentMember) {
					results.currentMember[category.name] = {
						value: category.nodeValue as number,
						icon: rules[category?.name]?.rawNode?.icônes,
					}
				}

				getSubcategories(rules, category, engine, true).forEach(
					(subCategory) => {
						if (!updatedAcc[subCategory.name]) {
							updatedAcc[subCategory.name] = {
								value: subCategory.nodeValue as number,
								icon:
									rules[subCategory?.name]?.rawNode?.icônes ??
									rules[category?.name]?.rawNode?.icônes,
							}
						} else {
							updatedAcc[subCategory.name].value +=
								subCategory.nodeValue as number
						}

						// Add each category footprint for the current member
						if (isCurrentMember) {
							results.currentMember[subCategory.name] = {
								value: subCategory.nodeValue as number,
								icon:
									rules[subCategory?.name]?.rawNode?.icônes ??
									rules[category?.name]?.rawNode?.icônes,
							}
						}
					}
				)
			})

			return updatedAcc
		}, {} as Record<string, ValueObject>)

	results.allMembers = allMembersSummedFootprintsByCategoriesAndSubCategories

	// Calculate the mean for the group for each category
	Object.keys(results.allMembers).forEach((key) => {
		results.allMembers[key].mean =
			results.allMembers[key].value / groupMembers.length
	})

	Object.keys(results.currentMember).forEach((key) => {
		results.currentMember[key].variation =
			((results.currentMember[key].value -
				(results?.allMembers?.[key]?.mean || 0)) /
				(results?.allMembers?.[key]?.mean || 1)) *
			100
	})

	const sortedCurrentMemberByVariation = Object.entries({
		...results.currentMember,
	})
		.map(([key, resultObject]) => ({ key, resultObject }))
		.sort((a, b) => {
			if (a?.resultObject?.variation === b?.resultObject?.variation) {
				return 0
			}
			if (a?.resultObject?.variation === undefined) {
				return 1
			}
			if (b?.resultObject?.variation === undefined) {
				return -1
			}
			return b?.resultObject?.variation - a?.resultObject?.variation
		}) as Points[]

	results.pointsForts = sortedCurrentMemberByVariation.slice(0, 2)
	results.pointsFaibles = sortedCurrentMemberByVariation.slice(-3)

	return results
}
