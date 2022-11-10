import { questionCategoryName } from 'Components/publicodesUtils'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { currentQuestionSelector } from 'Selectors/simulationSelectors'

// This is necessary to bring continuity to an animation
// it avoids returning null values (reseting the simulation) and then the
// same category as before null
export default (categories) => {
	const [displayedCategory, setDisplayedCategory] = useState(null)
	const currentQuestion = useSelector(currentQuestionSelector)

	useEffect(() => {
		const newCategory =
			currentQuestion &&
			categories.find(
				({ dottedName }) => dottedName === questionCategoryName(currentQuestion)
			)
		newCategory && setDisplayedCategory(newCategory)
	}, [currentQuestion, categories])

	return displayedCategory
}
