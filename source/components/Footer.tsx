import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'
import DocumentationButton from '../sites/publicodes/DocumentationButton'
import LandingContent from '../sites/publicodes/LandingContent'

export default ({ displaySponsorLogos = false }) => (
	<LandingContent background footer>
		<footer>
			{displaySponsorLogos && (
				<div
					css={`
						background: var(--lightestColor);
						display: flex;
						align-items: center;
						justify-content: center;
						flex-wrap: wrap;
						margin: 1rem;
						img {
							margin: 0 0.6rem;
						}
					`}
				>
					<img
						src="/images/logo-france-relance.svg"
						alt="Logo de France Relance"
						css="width: 5rem; height: auto; margin-right: .6rem"
						width="96"
						height="86"
					/>

					<div
						css={`
							display: flex;
							align-items: center;
							flex-direction: column;
							font-size: 90%;
							font-weight: bold;
						`}
					>
						<img
							src="/images/union-européenne.svg"
							alt="Logo de l'Union Européenne"
							css="width: 5rem; height: auto; margin-right: .6rem;"
							width="96"
							height="86"
						/>
						<span>NextGenerationEU</span>
					</div>
				</div>
			)}
			<div
				css={`
					display: flex;
					justify-content: center;
					align-items: center;
					flex-wrap: wrap;
					> * {
						margin: 0 0.6rem;
					}
					img {
						font-size: 120%;
					}
				`}
			>
				<Link to="/à-propos">
					<Trans>À propos</Trans>
				</Link>
				<DocumentationButton />
				<Link to="/diffuser">
					<Trans>Diffuser</Trans>
				</Link>
				<Link to="/nouveautés">
					<Trans>Nouveautés</Trans>
				</Link>
			</div>
			<div
				css={`
					display: flex;
					justify-content: center;
					align-items: center;
					> * {
						margin: 0 0.6rem;
						font-size: 80%;
					}
				`}
			>
				<Link to="/accessibilite" style={{ textDecoration: 'none' }}>
					<Trans>Accessibilité : partiellement conforme</Trans>
				</Link>
			</div>
		</footer>
	</LandingContent>
)
