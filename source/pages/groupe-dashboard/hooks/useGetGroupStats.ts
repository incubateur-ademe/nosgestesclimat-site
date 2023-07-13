import {
	DottedName,
	extractCategories,
	getSubcategories,
	NGCRules,
	safeGetRule,
} from '@/components/publicodesUtils'
import { useEngine } from '@/components/utils/EngineContext'
import { Member } from '@/types/groups'
import Engine, { RuleNode } from 'publicodes'

export type ValueObject = {
	title: string
	value: number
	mean?: number
	name: string
	variation?: number
	icon?: string
	isCategory?: boolean
}

type Points = {
	key: string
	resultObject: ValueObject
}

export type Results = {
	currentMemberAllFootprints: Record<string, ValueObject>
	groupCategoriesFootprints: Record<string, ValueObject>
	pointsForts: Points[]
	pointsFaibles: Points[]
}

const updateGroupCategoriesFootprints = ({
	updatedGroupCategoriesFootprints,
	category,
	rules,
	isCategory = true,
}) => {
	// If the category is not in the accumulator, we add its name as a new key in the object along with its value
	// otherwise we add the value to the existing sum
	if (!updatedGroupCategoriesFootprints[category.name]) {
		updatedGroupCategoriesFootprints[category.name] = {
			title: category.title,
			value: category.nodeValue as number,
			icon: rules[category?.name]?.rawNode?.icônes,
			isCategory,
		}
	} else {
		updatedGroupCategoriesFootprints[category.name].value +=
			category.nodeValue as number
	}
}

const updateCurrentMemberAllFootprints = ({
	updatedCurrentMemberAllFootprints,
	category,
	alternateCategory = { name: '' },
	rules,
	isCurrentMember,
}) => {
	// Add each category footprint for the current member
	if (isCurrentMember) {
		updatedCurrentMemberAllFootprints[category.name] = {
			title: category.title,
			value: category.nodeValue as number,
			icon:
				rules[category?.name]?.rawNode?.icônes ??
				(alternateCategory && rules[alternateCategory?.name]?.rawNode?.icônes),
			isCategory: true,
		}
	}
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
		currentMemberAllFootprints: {} as Record<string, ValueObject>,
		groupCategoriesFootprints: {},
		pointsForts: {} as Points[],
		pointsFaibles: {} as Points[],
	}

	const { groupCategoriesFootprints, currentMemberAllFootprints } =
		groupMembers.reduce(
			(
				{ groupCategoriesFootprints, currentMemberAllFootprints },
				groupMember: Member
			) => {
				// Create a copy of the accumulator
				const updatedGroupCategoriesFootprints = {
					...groupCategoriesFootprints,
				}
				const updatedCurrentMemberAllFootprints = {
					...currentMemberAllFootprints,
				}

				const isCurrentMember = groupMember.userId === userId

				// Set Situation of current member
				const safeSituation = Object.entries(
					groupMember?.simulation?.situation || {}
				).reduce((acc, [key, ruleNode]) => {
					if (safeGetRule(engine, key)) {
						return { ...acc, [key]: ruleNode }
					}
					return acc
				}, {} as Record<string, RuleNode>)

				engine.setSituation(safeSituation)

				const categories = extractCategories(rules, engine)

				categories.forEach((category) => {
					updateGroupCategoriesFootprints({
						updatedGroupCategoriesFootprints,
						category,
						rules,
					})

					updateCurrentMemberAllFootprints({
						updatedCurrentMemberAllFootprints,
						category,
						rules,
						isCurrentMember,
					})

					// Repeat the same process for each subcategory
					getSubcategories(
						rules as unknown as NGCRules,
						category,
						engine,
						true
					).forEach((subCategory) => {
						// Same here if the property doesn't exist in the accumulator, we add it
						// otherwise we add the value to the existing sum
						updateGroupCategoriesFootprints({
							updatedGroupCategoriesFootprints,
							category: subCategory,
							rules,
							isCategory: false,
						})

						updateCurrentMemberAllFootprints({
							updatedCurrentMemberAllFootprints,
							category: subCategory,
							alternateCategory: category,
							rules,
							isCurrentMember,
						})
					})
				})

				return {
					groupCategoriesFootprints: updatedGroupCategoriesFootprints,
					currentMemberAllFootprints: updatedCurrentMemberAllFootprints,
				}
			},
			{ groupCategoriesFootprints: {}, currentMemberAllFootprints: {} }
		)

	results.groupCategoriesFootprints = groupCategoriesFootprints
	results.currentMemberAllFootprints = currentMemberAllFootprints

	// Calculate the mean for the group for each category
	Object.keys(results.groupCategoriesFootprints).forEach((key) => {
		// Calculate mean for the group for each category
		results.groupCategoriesFootprints[key].mean =
			results.groupCategoriesFootprints[key].value / groupMembers.length
	})

	// Calculate the current user variation between its value and the group mean for each category
	// and subcategory
	Object.keys(results.currentMemberAllFootprints).forEach((key) => {
		results.currentMemberAllFootprints[key].variation =
			((results?.currentMemberAllFootprints?.[key]?.value -
				(results?.groupCategoriesFootprints?.[key]?.mean || 0)) /
				(results?.groupCategoriesFootprints?.[key]?.mean || 1)) *
			100
		/*
		console.log(key, results.currentMemberAllFootprints[key].variation) */
	})

	const sortedCurrentMemberByVariation = Object.entries(
		results.currentMemberAllFootprints
	)
		.filter(
			([, resultObject]) => !resultObject?.isCategory && resultObject?.value
		)
		.map(([key, resultObject]) => ({ key, resultObject }))
		.sort((a, b) => {
			if (a?.resultObject?.variation === b?.resultObject?.variation) {
				return 0
			}

			return (b?.resultObject?.variation || 0) >
				(a?.resultObject?.variation || 0)
				? -1
				: 1
		}) as Points[]

	results.pointsForts = sortedCurrentMemberByVariation.slice(0, 2)
	results.pointsFaibles = sortedCurrentMemberByVariation.slice(-3)

	return results as Results
}
