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
import NeutralH1 from 'Components/ui/NeutralH1'

export const sustainableLifeGoal = 2000 // kgCO2e
const sustainableBackground = '#78e08f'
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
				position: relative;
				display: flex;
				justify-content: space-evenly;
				align-items: flex-end;
				height: 50vh;
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
					bottom: ${(sustainableLifeGoal / empreinteTotale) * 100}%;

					left: 50%;
					position: absolute;
					border-bottom: 6px dashed ${color};
					height: 0.1rem;
					width: 80%;
					transform: translateX(-50%);
				`}
			/>
			<div
				css={`
					z-index: 1;
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
						right: 5vw;
						top: 0rem;
						margin-bottom: 1.4rem;
						background: #ffffff26;
						border-radius: 0.6rem;
						margin: 0 0.6rem;
						padding: 0rem 0.6rem;
						width: 10rem;
					`}
				>
					<div css="margin: .4rem 0; font-style: italic;">
						<NeutralH1 id="myFootprint">mon empreinte annuelle</NeutralH1>
						<img
							src="/images/thin-arrow-left.svg"
							title="Comprendre l'objectif à atteindre"
							css="height: 3rem; position: absolute;  left: -2rem; bottom: -3.4rem"
						/>
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
						aria-describedby="myFootprint"
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
				<div
					css={`
						background: #ffffff26;
						border-radius: 0.6rem;
						margin: 0 0.6rem;
						padding: 0.4rem 1rem;
						margin-bottom: 1rem;
					`}
				>
					<div id="objective">
						mon objectif
						<a
							css="color: inherit"
							href="https://ecolab.ademe.fr/blog/général/budget-empreinte-carbone-c-est-quoi.md"
							target="_blank"
							title="Comprendre l'ojectif de 2 tonnes"
						>
							<img
								src="/images/info.svg"
								aira-hidden
								css="width: 1.5rem; vertical-align: middle; margin-left: .2rem"
							/>
						</a>
					</div>
				</div>
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
					aria-describedby="objective"
				>
					<strong>{sustainableLifeGoal / 1000}</strong>
					<span>tonnes</span>
				</div>
				<div
					css={`
						${barBorderStyle}

						background: ${sustainableBackground};
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
			<div css="height: .3rem; background: black; width: 80%; position: absolute; bottom: 0; z-index: 10" />
		</section>
	)
}

const borderRadius = '.3rem'
const barBorderStyle = `
	border-radius: ${borderRadius};
	border: 4px solid #000;
	border-bottom-right-radius: 0;
	border-bottom-left-radius: 0;
`

const CategoriesBar = ({ categories, empreinteTotale, color }) => (
	<ul
		css={`
			margin: 0;
			width: ${barWidth};
			height: 100%;
			padding: 0;
			${barBorderStyle}
		`}
	>
		{categories.map((category, index) => (
			<li
				key={category.title}
				css={`
					${index === 0 &&
					`
					border-top-right-radius: ${borderRadius}; 
					border-top-left-radius: ${borderRadius}; 
					`};
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
							@media (min-height: 800px) {
								img {
									font-size: 180%;
								}
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
