import { useSelector } from 'react-redux'
import {
	analysisWithDefaultsSelector,
	parsedRulesSelector,
} from 'Selectors/analyseSelectors'
import { Link } from 'react-router-dom'
import Bar from './Bar'
import { utils } from 'publicodes'
const { encodeRuleName } = utils
import emoji from 'react-easy-emoji'
import { useEngine } from '../../../components/utils/EngineContext'
import { extractCategories } from '../../../components/publicodesUtils'
import { AnimatePresence, motion } from 'framer-motion'

const sustainableLifeGoal = 2000 // kgCO2e
const barWidth = '6rem'

const computeEmpreinteMaximum = (categories) =>
	categories.reduce(
		(memo, next) => (memo.nodeValue > next.nodeValue ? memo : next),
		-1
	).nodeValue

export default ({ details, color, noText, value, score }) => {
	const rules = useSelector((state) => state.rules)
	const engine = useEngine()
	const categories = extractCategories(rules, engine, details).map(
		(category) => ({
			...category,
			abbreviation: rules[category.dottedName].abbréviation,
		})
	)

	if (!categories) return null

	const empreinteMaximum = computeEmpreinteMaximum(categories)
	const empreinteTotale = categories.reduce(
		(memo, next) => next.nodeValue + memo,
		0
	)
	const roundedValue = (value / 1000).toLocaleString('fr-FR', {
			maximumSignificantDigits: 2,
			minimumSignificantDigits: 2,
		}),
		integerValue = roundedValue.split(',')[0],
		decimalValue = roundedValue.split(',')[1]
	return (
		<section
			css={`
				h2 {
					margin: 0.6rem 0 0.1rem;
					font-size: 140%;
				}
				strong {
					font-weight: 600;
				}
				padding: 0;
			`}
		>
			<div
				css={`
					position: relative;
					display: flex;
					justify-content: space-evenly;
					align-items: flex-end;
					height: 40vh;
				`}
			>
				<div
					css={`
						height: 100%;
						width: 50%;
						display: flex;
						flex-direction: column;
						align-items: center;
					`}
				>
					<div
						css={`
							position: absolute;
							right: 1rem;
							top: 0rem;
							margin-bottom: 1.4rem;
							background: #ffffff70;
							border-radius: 0.6rem;
							margin: 0 0.6rem;
							padding: 0.4rem 0.6rem;
						`}
					>
						<div css="margin: .4rem 0; font-style: italic">
							mon empreinte annuelle
						</div>
					</div>
					<div css="margin-bottom: .6rem">
						<div
							css={`
								width: 4rem;
								text-align: right;
								display: inline-block;
								font-weight: bold;
								font-size: 280%;
							`}
						>
							{integerValue}
							{score < 10000 && (
								<AnimatePresence>
									{(score - value) / score < 0.01 && (
										<motion.small
											initial={{ opacity: 0, width: 0 }}
											animate={{ opacity: 1, width: 'auto' }}
											css={`
												color: inherit;
												font-size: 60%;
											`}
										>
											,{decimalValue}
										</motion.small>
									)}
								</AnimatePresence>
							)}
						</div>{' '}
						<span css="font-size: 160%; ">tonnes</span>
					</div>
					<CategoriesBar {...{ categories, color, empreinteTotale }} />
				</div>
				<div css="display: flex; flex-direction: column; align-items: center; justify-content: end; flex-wrap: wrap; width: 50%; height: 100%">
					<a
						css="color: inherit"
						href="https://ecolab.ademe.fr/blog/général/budget-empreinte-carbone-c-est-quoi.md"
						target="_blank"
					>
						<div
							css={`
								background: #ffffff70;
								border-radius: 0.6rem;
								margin: 0 0.6rem;
								padding: 0.4rem 1rem;
								margin-bottom: 1rem;
							`}
						>
							<div>Mon objectif</div>
						</div>
					</a>
					<div
						css={`
							margin-bottom: 0.6rem;
							strong {
								font-size: 280%;
								margin-right: 0.3rem;
							}
							span {
								font-size: 160%;
							}
						`}
					>
						<strong>{sustainableLifeGoal / 1000}</strong>
						<span>tonnes</span>
					</div>
					<div
						css={`
							border-radius: 0.3rem;
							border: 3px solid ${color};
							background: #78e08f;
							height: ${(sustainableLifeGoal / empreinteTotale) * 100}%;
							width: ${barWidth};

							display: flex;
							flex-direction: column;
							justify-content: center;
							font-size: 200%;
						`}
					>
						{emoji('🎯')}
					</div>
				</div>
			</div>
		</section>
	)
}

const CategoriesBar = ({ categories, empreinteTotale, color }) => (
	<ul
		css={`
			margin: 0;
			width: ${barWidth};
			height: 100%;
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
					background: ${category.color};
					height: ${(category.nodeValue / empreinteTotale) * 100}%;
					display: flex;
					align-items: center;
					justify-content: center;
				`}
			>
				<Link to={'/documentation/' + encodeRuleName(category.dottedName)}>
					<div
						css={`
							height: 100%;
							img {
								font-size: 120%;
							}
						`}
					>
						{category.nodeValue / empreinteTotale > 0.1
							? emoji(category.icons)
							: ''}
					</div>
				</Link>
			</li>
		))}
	</ul>
)
