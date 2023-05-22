import Conversation, {
	ConversationProps,
} from '@/components/conversation/Conversation'
import * as animate from '@/components/ui/animate'

import React from 'react'

type SimulationProps = {
	explanations?: React.ReactNode
	results?: React.ReactNode
	showPeriodSwitch?: boolean
	showLinkToForm?: boolean
	animation?: keyof typeof animate
	conversationProps: Partial<ConversationProps>
}
export default function Simulation({
	explanations,
	results,
	animation = 'appear',
	conversationProps,
}: SimulationProps) {
	const Animation = animate[animation]
	return (
		<>
			<Animation delay={0.3}>
				{results}
				<Questions conversationProps={conversationProps} />
				{explanations}
			</Animation>
		</>
	)
}

function Questions({
	conversationProps,
}: {
	conversationProps: Partial<ConversationProps>
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
				<Conversation {...conversationProps} />
			</div>
		</>
	)
}
