import { Trans } from 'react-i18next'
import DefaultFootprint from '../sites/publicodes/DefaultFootprint'

export default ({ openExplanation, setOpenExplanation }) => {
	return (
		openExplanation && (
			<div
				className="ui__ card"
				css={`
					position: relative;
					padding: 1.8rem 1.2rem 0.5rem 1.5rem;
					top: 0.5rem;
					@media (max-width: 800px) {
						max-height: 15rem;
						position: fixed;
						top: auto;
						bottom: 9rem;
						margin-left: 0.5rem;
						margin-right: 0.5rem;
					}
				`}
			>
				<p
					css={`
						font-size: 90% !important;
						text-align: left !important;
						color: var(--darkColor) !important;
						line-height: 1.1rem;
						> a {
							text-decoration: underline !important;
						}
					`}
				>
					➡️
					<Trans i18nKey={'components.ScoreExplanation.text'}>
						<DefaultFootprint /> de CO2-e par an, c'est{' '}
						<b>un point de départ théorique</b> calculé à partir de valeurs par
						défaut attribuées à l'avance à chaque question. Au fur et à mesure
						de vos réponses, vous{' '}
						<b>personnalisez votre score selon votre mode de vie</b>. Si vous
						répondez "je ne sais pas" à une question, vous remarquerez que le
						total ne change pas puisqu'une valeur standard vous est attribuée
						dans ce cas. Il est fréquent que le score initial change car
						<a href="https://nosgestesclimat.fr/nouveaut%C3%A9s/">
							le modèle Nos Gestes Climat évolue
						</a>
						!
					</Trans>
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
					title="Fermer la notification d'explication"
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
						<Trans>J'ai compris</Trans>
					</button>
				</div>
			</div>
		)
	)
}
