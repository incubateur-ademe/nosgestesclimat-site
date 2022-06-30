import { ASTNode } from 'publicodes'
import { toPairs } from 'ramda'
import { useState } from 'react'
import emoji from 'react-easy-emoji'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { updateSituation } from 'Actions/actions'

type InputSuggestionsProps = {
	dottedName: string
	relatedRuleNames: Array<string>
	suggestions?: Record<string, ASTNode>
}

export default function MosaicInputSuggestions({
	dottedName,
	relatedRuleNames,
	suggestions = {},
}: InputSuggestionsProps) {
	const { t, i18n } = useTranslation()
	const dispatch = useDispatch()

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
			{toPairs(suggestions).map(([text, values]: [string, ASTNode]) => {
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
							relatedRuleNames.map((elt) => dispatch(updateSituation(elt, 0)))
							toPairs(values).map(([ruleName, value]: [string, ASTNode]) => {
								const fullDottedName = `${dottedName} . ${ruleName}`
								dispatch(updateSituation(fullDottedName, value))
							})
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
