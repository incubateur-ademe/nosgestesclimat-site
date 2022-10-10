import { ASTNode } from 'publicodes'
import { useState } from 'react'
import emoji from 'react-easy-emoji'
import { useTranslation } from 'react-i18next'

type InputSuggestionsProps = {
	suggestions?: Record<string, ASTNode>
	onFirstClick: (val: ASTNode) => void
	onSecondClick?: (val: ASTNode) => void
}

export default function InputSuggestions({
	suggestions = {},
	onSecondClick = (x) => x,
	onFirstClick,
}: InputSuggestionsProps) {
	const [suggestion, setSuggestion] = useState<ASTNode>()
	const { t, i18n } = useTranslation()

	return (
		<div
			className="ui__ notice"
			css={`
				display: flex;
				align-items: baseline;
				justify-content: flex-end;
				margin-bottom: 0.4rem;
				flex-wrap: wrap;

				@media (max-width: 800px) {
					flex-wrap: nowrap;
					overflow-x: auto;
					white-space: nowrap;
					justify-content: normal;
					height: 1.6rem;
					scrollbar-width: none;
					::-webkit-scrollbar {
						display: none;
					}
				}
			`}
		>
			{Object.entries(suggestions).map(([text, value]: [string, ASTNode]) => {
				return (
					<button
						className="ui__ suggestion plain button"
						type="button"
						key={text}
						css={`
							margin: 0.2rem 0.4rem !important;
							:first-child {
								margin-left: 0rem !important;
							}
						`}
						onClick={() => {
							onFirstClick(value)
							if (suggestion !== value) setSuggestion(value)
							else onSecondClick && onSecondClick(value)
						}}
						title={t('Insérer cette suggestion')}
					>
						{emoji(text)}
					</button>
				)
			})}
		</div>
	)
}
