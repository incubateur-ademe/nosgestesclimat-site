import { ASTNode } from 'publicodes'
import { useState } from 'react'
import emoji from 'react-easy-emoji'
import { useTranslation } from 'react-i18next'

type InputSuggestionsProps = {
	suggestions?: Record<string, ASTNode>
	onFirstClick: (val: ASTNode) => void
	onSecondClick?: (val: ASTNode) => void
	isDisabled?: boolean
}

export default function InputSuggestions({
	suggestions = {},
	onSecondClick = (x) => x,
	onFirstClick,
	isDisabled,
}: InputSuggestionsProps) {
	const [suggestion, setSuggestion] = useState<ASTNode>()
	const { t } = useTranslation()

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
						aria-disabled={isDisabled}
						css={`
							margin: 0.2rem 0.4rem !important;
							:first-child {
								margin-left: 0rem !important;
							}
							&[aria-disabled='true'] {
								opacity: 0.7;
								cursor: not-allowed;
							}
						`}
						onClick={() => {
							if (isDisabled) {
								return
							}

							onFirstClick(value)
							if (suggestion !== value) setSuggestion(value)
							else onSecondClick && onSecondClick(value)
						}}
						title={
							isDisabled
								? t('Désactivé lors du remplissage du détail des trajets.')
								: t('Insérer cette suggestion')
						}
					>
						{emoji(text)}
					</button>
				)
			})}
		</div>
	)
}
