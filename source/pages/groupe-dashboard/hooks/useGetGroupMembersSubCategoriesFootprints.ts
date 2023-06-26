import {
	DottedName,
	extractCategories,
	getSubcategories,
} from '@/components/publicodesUtils'
import { useEngine } from '@/components/utils/EngineContext'
import { Member } from '@/types/groups'
import Engine from 'publicodes'

export const useGetGroupMembersSubCategoriesFootprints = ({
	groupMembers,
	userId,
}: {
	groupMembers: Member[]
	userId: string
}) => {
	const engine: Engine<DottedName> = useEngine()

	const rules = engine.getParsedRules()

	if (!groupMembers) return

	const summedFootprints = {
		currentMember: {},
		allMembers: {},
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
						value: category.nodeValue,
						icon: rules[category?.name]?.rawNode?.icônes,
					}

					// Add each category footprint for the current member
					if (isCurrentMember) {
						summedFootprints.currentMember[category.name] = {
							value: category.nodeValue,
							icon: rules[category?.name]?.rawNode?.icônes,
						}
					}
				} else {
					updatedAcc[category.name].value += category.nodeValue
				}

				getSubcategories(rules, category, engine, true).forEach(
					(subCategory) => {
						if (!updatedAcc[subCategory.name]) {
							updatedAcc[subCategory.name] = {
								value: subCategory.nodeValue,
								icon:
									rules[subCategory?.name]?.rawNode?.icônes ??
									rules[category?.name]?.rawNode?.icônes,
							}

							// Add each category footprint for the current member
							if (isCurrentMember) {
								summedFootprints.currentMember[subCategory.name] = {
									value: subCategory.nodeValue,
									icon:
										rules[subCategory?.name]?.rawNode?.icônes ??
										rules[category?.name]?.rawNode?.icônes,
								}
							}
						} else {
							updatedAcc[subCategory.name].value += subCategory.nodeValue
						}
					}
				)
			})

			return updatedAcc
		}, {})

	summedFootprints.allMembers =
		allMembersSummedFootprintsByCategoriesAndSubCategories

	return summedFootprints
}
