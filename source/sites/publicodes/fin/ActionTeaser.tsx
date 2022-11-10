import { correctValue, splitName } from 'Components/publicodesUtils'
import { EngineContext } from 'Components/utils/EngineContext'
import { partition } from 'ramda'
import { useContext } from 'react'
import { useSelector } from 'react-redux'
import { extractCategoriesNamespaces } from '../../../components/publicodesUtils'
import { sortBy } from '../../../utils'
import { ActionValue, disabledAction } from '../ActionVignette'
import emoji from 'react-easy-emoji'
import CircledEmojis from '../../../components/CircledEmojis'
import { motion } from 'framer-motion'
import { Trans, useTranslation } from 'react-i18next'
import {
	getLangFromAbreviation,
	getLangInfos,
} from '../../../locales/translation'

export default ({}) => {
	const { i18n } = useTranslation()
	const currentLangInfos = getLangInfos(getLangFromAbreviation(i18n.language))

	const rules = useSelector((state) => state.rules)

	const flatActions = rules['actions']

	const objectifs = ['bilan', ...flatActions.formule.somme]

	const engine = useContext(EngineContext)

	const targets = objectifs.map((o) => engine.evaluate(o))

	const categories = extractCategoriesNamespaces(rules, engine)

	const [bilans, actions] = partition((t) => t.dottedName === 'bilan', targets),
		total = bilans[0].nodeValue,
		displayedTotal = (total / 1000).toLocaleString(
			currentLangInfos.abrvLocale,
			{
				maximumSignificantDigits: 2,
			}
		)

	// This is arbitrary. The chances that most actions are harder at this stages are high
	// it could also be set to 3000
	const lowScore = 4000

	if (total < lowScore)
		return (
			<div
				css={`
					background: radial-gradient(
						circle,
						rgb(87, 88, 187) 55%,
						rgb(48, 144, 218) 100%
					);
					padding: 1rem;
					color: white;
					margin: 2rem auto;
					width: 85%;
					border-radius: 0.6rem;
				`}
			>
				<div
					css={`
						display: flex;
						text-align: left;
						justify-content: start;
						@media (max-width: 800px) {
							flex-direction: column;
							justify-content: center;
							align-items: center;

							p {
								text-align: center;
							}
						}
						img {
							font-size: 200%;
							width: 4rem;
						}
						margin-bottom: 0.6rem;
					`}
				>
					<div>{emoji('👏')}</div>
					<p>
						<Trans i18nKey={'publicodes.fin.ActionTeaser.félicitations'}>
							{{ displayedTotal }} tonnes !
							<strong>
								{' '}
								Vous êtes très nettement en-dessous de la moyenne française.
							</strong>{' '}
						</Trans>
					</p>
				</div>
				<p>
					<Trans i18nKey={'publicodes.fin.ActionTeaser.messagePourConvaincre'}>
						Il y a de grandes chances que votre temps soit plus efficace à
						convaincre et aider les autres qu'à chercher à gagner vos "tonnes en
						trop" (même s'il faudra le faire un jour).
					</Trans>
				</p>
			</div>
		)

	const sortedActionsByImpact = sortBy((a) => -correctValue(a))(actions),
		interestingActions = sortedActionsByImpact.filter((action) => {
			const flatRule = rules[action.dottedName]
			const disabled = disabledAction(flatRule, action.nodeValue)
			return !disabled
		}),
		topActions = interestingActions.reduce((memo, next) => {
			const dépasse = rules[next.dottedName].action?.dépasse
			const category = splitName(next.dottedName)[0]

			if (memo.length === 3) return memo
			if (
				memo.find(([_, action, foundDépasse]) =>
					foundDépasse.includes(next.dottedName)
				)
			)
				return memo
			return [...memo, [category, next, dépasse || []]]
		}, [])

	const variants = {
		open: {
			transition: { staggerChildren: 0.4, delayChildren: 0.1 },
		},
	}

	const itemVariants = {
		open: {
			y: 0,
			opacity: 1,
			transition: {
				y: { stiffness: 1000, velocity: -100 },
			},
		},
		closed: {
			y: 50,
			opacity: 0,
			transition: {
				y: { stiffness: 1000 },
			},
		},
	}

	return (
		<motion.ul
			variants={variants}
			initial="closed"
			animate="open"
			css={`
				list-style-type: none;
				padding-left: 0;
				width: 100%;
				@media (min-width: 800px) {
					width: 90%;
				}

				margin: 0 auto;
			`}
		>
			{topActions.map(([category, action]) => (
				<motion.li
					variants={itemVariants}
					css={`
						padding: 0.4rem 1rem;
						background: ${categories.find((cat) => cat.dottedName === category)
							.color};
						color: white;
						h2 {
							color: inherit;
							font-size: 110%;
							text-align: left;
							margin: 0.8rem;
						}
						margin: 0.6rem;
						border-radius: 0.4rem;
						display: flex;
						flex-direction: column;
					`}
				>
					<div
						css={`
							display: flex;
							align-items: center;
							justify-content: start;
							border-bottom: 1px solid #ffffff40;
						`}
					>
						<div
							css={`
								margin-right: 2.5rem;
								transform: scale(1.5);
								@media (min-width: 800px) {
									transform: scale(2);
								}
								width: 4rem;
							`}
						>
							<CircledEmojis emojis={rules[action.dottedName].icônes} />
						</div>
						<h2>{action.title}</h2>
					</div>
					<div css="margin: .6rem ; text-align: right">
						<ActionValue
							{...{ dottedName: action.dottedName, total, engine }}
						/>
					</div>
				</motion.li>
			))}
		</motion.ul>
	)
}
