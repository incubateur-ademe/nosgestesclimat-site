import { AnimatePresence, motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { correctValue } from '../../components/publicodesUtils'
import ActionConversation from './ActionConversation'
import { ActionListCard } from './ActionVignette'
import animate from 'Components/ui/animate'
import { ScrollToElement } from '../../components/utils/Scroll'
import IllustratedButton from '../../components/IllustratedButton'
import styled from 'styled-components'
import { Trans } from 'react-i18next'

const thresholds = [
	[10000, 'plus de 10 tonnes'],
	[1000, "plus d'1 tonne"],
	[100, 'plus de 100 kg'],
	[10, 'plus de 10 kg'],
	[1, "plus d'1 kg"],
]

export default ({
	actions: rawActions,
	bilan,
	rules,
	focusedAction,
	focusAction,
	radical,
}) => {
	const actions = rawActions.map((a) => ({
		...a,
		value: correctValue({ nodeValue: a.nodeValue, unit: a.unit }),
	}))

	const actionChoices = useSelector((state) => state.actionChoices)
	const rejected = actions.filter((a) => actionChoices[a.dottedName] === false)
	const notRejected = actions.filter(
		(a) => actionChoices[a.dottedName] !== false
	)
	const maxImpactAction = notRejected.reduce(
		(memo, next) => {
			return next.value > memo.value ? next : memo
		},
		{ value: 0 }
	)
	const numberedActions = thresholds.map(([threshold, label], index) => {
		const thresholdActions = notRejected.filter(
			(a) =>
				a.value >= threshold &&
				(index === 0 || a.value < thresholds[index - 1][0])
		)
		if (!thresholdActions.length) return null
		return (
			<div>
				<List
					{...{
						actions: thresholdActions,
						rules,
						bilan,
						actionChoices,
						focusAction,
						focusedAction,
					}}
				/>
				<ThresholdSeparator>
					<p>{label} &#9650;</p>
				</ThresholdSeparator>
			</div>
		)
	})

	return (
		<div>
			{maxImpactAction.value < 100 && (
				<animate.fromTop>
					<div
						className="ui__ card box"
						css="margin: 0 auto .6rem !important; "
					>
						<Trans i18nKey={'publicodes.AllActions.msgPlusActions'}>
							<p>
								Nous n'avons plus d'actions chiffrées très impactantes à vous
								proposer 🤷
							</p>
							<p>Découvrez plus bas quelques pistes pour agir autrement ⏬</p>
						</Trans>
					</div>
				</animate.fromTop>
			)}

			{radical ? numberedActions : numberedActions.slice().reverse()}

			<ThresholdSeparator>
				<p>
					<img
						src="/images/270A.svg"
						css="filter: invert(1); height: 2rem; vertical-align: middle"
					/>
					<Trans>Actions non chiffrées</Trans> &#9660;
				</p>
			</ThresholdSeparator>
			<List
				{...{
					actions: notRejected.filter((a) => a.value === undefined),
					rules,
					bilan,
					actionChoices,
					focusAction,
					focusedAction,
				}}
			/>
			<ThresholdSeparator>
				<p>
					<img
						src="/images/26D4.svg"
						css="filter:invert(1); height: 2rem; vertical-align: middle; margin-right: .3rem"
					/>
					<Trans>Actions négatives</Trans> &#9660;
				</p>
			</ThresholdSeparator>
			<List
				{...{
					actions: notRejected.filter((a) => a.value < 0),
					rules,
					bilan,
					actionChoices,
					focusAction,
					focusedAction,
				}}
			/>
			{rejected.length > 0 && (
				<div>
					<h2>
						<Trans>Actions écartées :</Trans>
					</h2>
					<List
						{...{
							actions: rejected,
							rules,
							bilan,
							actionChoices,
							focusAction,
							focusedAction,
						}}
					/>
				</div>
			)}
			<IllustratedButton icon="📚" to="/actions/plus">
				<div>
					<Trans i18nKey={'publicodes.AllActions.allerPlusLoin'}>
						<h2>Aller plus loin</h2>
						<p>
							<small>
								Au-delà d'un simple chiffre, découvrez les enjeux qui se cachent
								derrière chaque action.
							</small>
						</p>
					</Trans>
				</div>
			</IllustratedButton>
		</div>
	)
}

const List = ({ actions, rules, bilan, focusedAction, focusAction }) => (
	<ul
		css={`
			display: flex;
			justify-content: center;
			align-items: center;
			flex-wrap: wrap;
			list-style-type: none;
			padding-left: 0;
		`}
	>
		<AnimatePresence>
			{actions.map((evaluation) => {
				const cardComponent = (
					<motion.li
						key={evaluation.dottedName}
						layoutId={evaluation.dottedName}
						animate={{ scale: 1 }}
						initial={{ scale: 0.8 }}
						exit={{ scale: 0.2 }}
						transition={{ duration: 1 }}
						css={`
							width: 12rem;
							height: 16rem;
							margin: 0.4rem;
						`}
					>
						<ActionListCard
							focusAction={focusAction}
							focused={focusedAction === evaluation.dottedName}
							key={evaluation.dottedName}
							rule={rules[evaluation.dottedName]}
							evaluation={evaluation}
							total={bilan?.nodeValue}
						/>
					</motion.li>
				)
				if (focusedAction === evaluation.dottedName) {
					const convId = 'conv'
					return (
						<>
							<motion.li
								key={convId}
								layoutId={convId}
								animate={{ scale: 1 }}
								initial={{ scale: 0.8 }}
								exit={{ scale: 0.2 }}
								transition={{ duration: 0.5 }}
								css={`
									margin-top: 1.6rem 1rem 1rem;
									width: 100%;
									height: auto;
								`}
							>
								<ActionConversation
									key={focusedAction}
									dottedName={focusedAction}
								/>
								<ScrollToElement delay={1000} center />
							</motion.li>
							{cardComponent}
						</>
					)
				}
				return cardComponent
			})}
		</AnimatePresence>
	</ul>
)

const ThresholdSeparator = styled.div`
	width: 100%;
	height: 2rem;
	text-align: center;
	margin-bottom: 1em;
	p {
		display: inline-block;
		font-weight: 400;
		font-size: 1em;
		padding: 0 0.8rem;
		background: var(--darkColor);
		color: white;
		border-radius: 1rem;
		margin-top: 0.5em;
	}
`
