import emoji from './emoji'

export default ({ openExplanation, setOpenExplanation }) => {
	return (
		openExplanation && (
			<div
				className="ui__ card"
				css={`
					position: relative;
					top: -0.5rem;
					padding: 1.2rem 1.2rem 0.5rem 1.5rem;
				`}
			>
				<p
					css={`
						font-size: 90% !important;
						text-align: left !important;
						color: var(--darkColor) !important;
						line-height: 1.1rem;
					`}
				>
					{emoji('➡️ ')}Votre point de départ est le résultat du test calculé à
					partir de valeurs moyennes Françaises attribuées à chaque question. Au
					fur et à mesure de vos réponses, vous personnalisez votre score selon
					votre mode de vie. Si vous répondez "je ne sais pas" à une question,
					vous remarquerez que le total ne change pas puisqu'une valeur moyenne
					vous est attribuée dans ce cas. Il est fréquent que le score initial
					change car{' '}
					<a href="https://nosgestesclimat.fr/nouveaut%C3%A9s/">
						le modèle Nos Gestes Climat évolue
					</a>{' '}
					!
				</p>
				<button
					onClick={() => setOpenExplanation(false)}
					css={`
						border: none;
						font-size: 140%;
						color: var(--color);
						position: absolute;
						right: 0.3rem;
						top: 0.3rem;
						padding: 0;
					`}
					title="Fermer la notification de nouveautés"
				>
					&times;
				</button>
				<div
					css={`
						display: flex;
						justify-content: flex-end;
					`}
				>
					<button
						className="ui__ button plain small"
						onClick={() => setOpenExplanation(false)}
						css={`
							font-size: 80% !important;
							padding: 0.3rem !important;
						`}
					>
						J'ai compris
					</button>
				</div>
			</div>
		)
	)
}
