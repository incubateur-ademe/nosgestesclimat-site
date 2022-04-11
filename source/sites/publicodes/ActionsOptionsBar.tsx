import ActionsChosenIndicator from './ActionsChosenIndicator'

export default ({ finalActions, setRadical, radical }) => {
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
			>
				{radical ? (
					<span>le + d'impact climat</span>
				) : (
					<span>le - d'impact climat</span>
				)}
				.
			</button>
		</div>
	)
}
