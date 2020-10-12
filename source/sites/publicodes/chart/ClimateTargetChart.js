import React from 'react'
import { getCategories, computeEmpreinteMaximum } from './index'
import { useSelector } from 'react-redux'
import {
	analysisWithDefaultsSelector,
	parsedRulesSelector,
} from 'Selectors/analyseSelectors'
import { Link } from 'react-router-dom'
import { getRuleFromAnalysis, encodeRuleName } from 'Engine/rules'
import Bar from './Bar'
import emoji from 'react-easy-emoji'

export default ({ details, color, noText }) => {
	const analysis = useSelector(analysisWithDefaultsSelector),
		rules = useSelector(parsedRulesSelector)

	const categories = getCategories(analysis, details, rules)

	if (!categories) return null

	const empreinteMaximum = computeEmpreinteMaximum(categories)
	const empreinteTotale = categories.reduce(
		(memo, next) => next.nodeValue + memo,
		0
	)
	return (
		<section
			css={`
				h2 {
					margin: 0.6rem 0 0.1rem;
					font-size: 140%;
				}
				padding: 0;
			`}
		>
			<div
				css={`
					position: relative;
				`}
			>
				<ul
					css={`
						margin-left: 2rem;
						width: 4rem;
						height: 18rem;
						border-radius: 0.3rem;
						border: 3px solid ${color};
						padding: 0;
					`}
				>
					{categories.map((category) => (
						<li
							key={category.title}
							css={`
								margin: 0;
								list-style-type: none;
								> a {
									display: block;
									text-decoration: none;
									line-height: inherit;
								}
								background: ${category.couleur};
								height: ${(category.nodeValue / empreinteTotale) * 100}%;
								display: flex;
								align-items: center;
								justify-content: center;
							`}
						>
							<Link
								to={'/documentation/' + encodeRuleName(category.dottedName)}
							>
								<div
									css={`
										height: 100%;
									`}
								>
									{emoji(category.icons)}
								</div>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</section>
	)
}
