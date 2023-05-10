import Conversation, {
	ConversationProps,
} from '@/components/conversation/Conversation'
import { Category } from '@/components/publicodesUtils'
import * as animate from '@/components/ui/animate'

import React from 'react'

type SimulationProps = {
	orderByCategories: Category[]
	explanations?: React.ReactNode
	results?: React.ReactNode
	customEndMessages?: ConversationProps['customEndMessages']
	customEnd?: ConversationProps['customEnd']
	showPeriodSwitch?: boolean
	showLinkToForm?: boolean
	animation?: keyof typeof animate
	questionHeadingLevel?: number
}

export default function Simulation({
	explanations,
	results,
	customEndMessages,
	customEnd,
	orderByCategories,
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
}: SimulationProps) {
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
