import { questionCategoryName } from 'Components/publicodesUtils'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { currentQuestionSelector } from 'Selectors/simulationSelectors'

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
	}, [currentQuestion])
	return displayedCategory
}
