import { extractCategories } from 'Components/publicodesUtils'
import { useEngine } from 'Components/utils/EngineContext'
import { motion } from 'framer-motion'
import { utils } from 'publicodes'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { objectifsSelector } from 'Selectors/simulationSelectors'
import styled from 'styled-components'
import { useNextQuestions } from '../../../components/utils/useNextQuestion'
import Bar from './Bar'

export default ({
	details,
	noText,
	noCompletion,
	valueColor,
	linkTo,
	demoMode,
	noAnimation,
}) => {
	// needed for this component to refresh on situation change :
	const objectifs = useSelector(objectifsSelector)
	const rules = useSelector((state) => state.rules)
	const engine = useEngine(objectifs)
	const categories = extractCategories(rules, engine, details).map(
		(category) => ({
			...category,
			abbreviation: rules[category.dottedName].abréviation,
		})
	)
	const { pathname } = useLocation(),
		navigate = useNavigate()

	const nextQuestions = useNextQuestions()
	const completedCategories = categories
		.filter(
			({ dottedName }) =>
				!nextQuestions.find((question) => question.includes(dottedName))
		)
		.map(({ dottedName }) => dottedName)

	if (!categories) return null

	const empreinteMaximum = categories.reduce(
		(memo, next) => (memo.nodeValue > next.nodeValue ? memo : next),
		-1
	).nodeValue

	const { t } = useTranslation()

	return (
		<section
			css={`
				h2 {
					margin: 0.6rem 0 0.1rem;
					font-size: 140%;
				}
				padding: 0;
				margin: 1rem 0;
			`}
		>
			<div
				css={`
					margin-top: 1rem;
					position: relative;
				`}
			>
				<ul
					css={`
						margin-left: 2rem;

						@media (min-width: 800px) {
							max-width: 35rem;
						}
					`}
				>
					{categories.map((category) => {
						const bar = (
							<Bar
								{...{
									...category,
									demoMode,
									noText,
									empreinteMaximum,
									completed:
										!noCompletion &&
										completedCategories.find((c) => c === category.dottedName),
									valueColor,
								}}
							/>
						)
						return (
							<BarContainer
								as={noAnimation ? null : motion.li}
								layout
								key={category.title}
							>
								{!demoMode ? (
									linkTo === 'documentation' ? (
										<Link
											to={
												'/documentation/' +
												utils.encodeRuleName(category.documentationDottedName)
											}
										>
											{bar}
										</Link>
									) : (
										<div
											type="button"
											css={`
												cursor: pointer;
											`}
											title={
												t(`N'afficher que les questions `) + category.dottedName
											}
											onClick={() =>
												navigate(`${pathname}?catégorie=${category.dottedName}`)
											}
										>
											{bar}
										</div>
									)
								) : (
									bar
								)}
							</BarContainer>
						)
					})}
				</ul>
			</div>
		</section>
	)
}

const BarContainer = styled.li`
	margin: 0.4rem 0;
	list-style-type: none;
	> a {
		display: block;
		text-decoration: none;
		line-height: inherit;
	}
`
