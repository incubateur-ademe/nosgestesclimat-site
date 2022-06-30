import { EngineContext } from 'Components/utils/EngineContext'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useContext, useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import { correctValue } from '../../components/publicodesUtils'
import { sortBy } from '../../utils'
import ActionConversation from './ActionConversation'
import { ActionListCard } from './ActionVignette'
import animate from 'Components/ui/animate'
import { ScrollToElement } from '../../components/utils/Scroll'
import DisableScroll from '../../components/utils/DisableScroll'
import IllustratedButton from '../../components/IllustratedButton'
import styled from 'styled-components'

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
	const engine = useContext(EngineContext)

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
						<p>
							Nous n'avons plus d'actions chiffrées très impactantes à vous
							proposer {emoji('🤷')}
						</p>
						<p>
							Découvrez plus bas quelques pistes pour agir autrement{' '}
							{emoji('⏬')}
						</p>
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
					Actions non chiffrées &#9660;
				</p>
			</ThresholdSeparator>
			<List
				{...{
					actions: notRejected.filter((a) => a.value == null),
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
					Actions négatives &#9660;
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
					<h2>Actions écartées:</h2>
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
					<h2>Aller plus loin</h2>
					<p>
						<small>
							Au-delà d'un simple chiffre, découvrez les enjeux qui se cachent
							derrière chaque action.
						</small>
					</p>
				</div>
			</IllustratedButton>
		</div>
	)
}

const List = ({
	actions,
	rules,
	bilan,
	actionChoices,
	focusedAction,
	focusAction,
}) => (
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
							width: 11rem;
							height: 16rem;
							margin: 0.4rem;

							@media (min-width: 800px) {
								width: 12rem;
							}
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
