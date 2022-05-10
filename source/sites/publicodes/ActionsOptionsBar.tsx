import { useState } from 'react'
import emoji from '../../components/emoji'
import ActionsChosenIndicator from './ActionsChosenIndicator'

export default ({ finalActions, setRadical, radical }) => {
	const [visible, setVisible] = useState(false)
	if (!visible)
		return (
			<div css="text-align: right; position: absolute;right: 0; button {font-size: 100%}">
				<button
					title="Ouvrir les options de tri"
					onClick={() => setVisible(true)}
				>
					{emoji('⚙️')}
				</button>
			</div>
		)
	return (
		<div
			css={`
				display: block;
				text-align: center;
			`}
		>
			<small>
				{finalActions.length} actions disponibles, <ActionsChosenIndicator />
				sélectionnées.
			</small>{' '}
			<small css="@media(max-width: 800px){display: none}">
				Triées par :
			</small>{' '}
			<small css="@media(min-width: 800px){display: none}">Tri :</small>{' '}
			<button
				onClick={() => setRadical(!radical)}
				className="ui__ dashed-button"
				css="color: var(--lighterTextColor); font-size: 85% !important"
				title="Choisir le type de tri des actions"
			>
				{radical ? (
					<span>le + d'impact climat</span>
				) : (
					<span>le - d'impact climat</span>
				)}
				.
			</button>
			<button
				title="Fermer les options de tri"
				onClick={() => setVisible(false)}
			>
				{emoji('❌')}
			</button>
		</div>
	)
}
