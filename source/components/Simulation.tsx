import Conversation, {
	ConversationProps,
} from 'Components/conversation/Conversation'
import * as animate from 'Components/ui/animate'
import React from 'react'
import { Trans } from 'react-i18next'
import LinkToForm from './Feedback/LinkToForm'

type SimulationProps = {
	explanations?: React.ReactNode
	results?: React.ReactNode
	customEndMessages?: ConversationProps['customEndMessages']
	showPeriodSwitch?: boolean
	showLinkToForm?: boolean
	orderByCategories: Array<Object>
}

export default function Simulation({
	explanations,
	results,
	customEndMessages,
	customEnd,
	orderByCategories,
	showPeriodSwitch,
	animation = 'appear',
	questionHeadingLevel,
}: SimulationProps) {
	const Animation = animate[animation]
	return (
		<>
			<Animation delay={0.3}>
				{results}
				<Questions
					customEnd={customEnd}
					orderByCategories={orderByCategories}
					customEndMessages={customEndMessages}
					questionHeadingLevel={questionHeadingLevel}
				/>
				{explanations}
			</Animation>
		</>
	)
}

function Questions({
	customEndMessages,
	customEnd,
	orderByCategories,
	questionHeadingLevel,
}: {
	customEndMessages?: ConversationProps['customEndMessages']
	orderByCategories: Array<Object>
}) {
	return (
		<>
			<div
				className="ui__ lighter-bg"
				css={`
					@media (min-width: 800px) {
						margin-top: 0.6rem;
					}
					border-radius: 0.6rem;
				`}
			>
				<Conversation
					orderByCategories={orderByCategories}
					customEnd={customEnd}
					customEndMessages={customEndMessages}
					questionHeadingLevel={questionHeadingLevel}
				/>
			</div>
		</>
	)
}
