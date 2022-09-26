import LogoADEME from 'Images/logoADEME.svg'
import Markdown from 'markdown-to-jsx'
import landingMd from 'raw-loader!./landing.md'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import avantages from './avantages.yaml'
import DocumentationButton from './DocumentationButton'
import LandingContent from './LandingContent'

const fluidLayoutMinWidth = '1200px'

export default () => (
	<>
		<div
			css={`
				width: 100%;
				text-align: center;
				h2 {
					font-size: 170%;
				}

				p {
					max-width: 45rem;
					margin: 1rem auto;
				}
			`}
		>
			<LandingContent background>
				<Markdown>{landingMd}</Markdown>
			</LandingContent>
			<LandingContent>
				<h2>Ouvert, documenté et contributif</h2>
				<div
					css={`
						img {
							width: 2.6rem;
							height: auto;
							margin: 0.4rem;
						}
						display: flex;
						justify-content: center;
						align-items: center;
						flex-wrap: wrap;
						> div {
							width: 14rem;
							height: 14rem;
							justify-content: center;
						}
						@media (max-width: ${fluidLayoutMinWidth}) {
							flex-direction: column;
						}
					`}
				>
					{avantages.map((el) => (
						<div key={el.icon} className="ui__ card box">
							{emoji(el.illustration)}

							<div>
								<Markdown>{el.text}</Markdown>
							</div>
						</div>
					))}
				</div>
				<Markdown
					children={`
## Des questions ?

Retrouvez les réponses aux questions courantes sur notre page [FAQ](/contribuer).
					`}
				/>
			</LandingContent>
		</div>

		<LandingContent background footer>
			<footer>
				<div
					css={`
						background: var(--lightestColor);
						display: flex;
						align-items: center;
						justify-content: center;
						margin-bottom: 1rem;
						img {
							margin: 0 0.6rem;
						}
					`}
				>
					<img
						src="/images/marianne.svg"
						alt="République Française"
						css="width: 7.5rem; height: auto; margin-right: .6rem"
						width="96"
						height="86"
					/>
					<a href="https://ademe.fr">
						<LogoADEME />
					</a>
					<a href="https://abc-transitionbascarbone.fr">
						<img
							css="width: 6rem; height: auto;margin-left: 1rem !important"
							src="https://abc-transitionbascarbone.fr/wp-content/uploads/2022/02/logo-ABC-web.png"
							alt="Logo de l'Association pour la transition Bas Carbone"
							width="86"
							height="29"
						/>
					</a>
				</div>
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
					<Link to="/à-propos">À propos</Link>
					<DocumentationButton />
					<Link to="/diffuser">Diffuser</Link>
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
						Accessibilité : partiellement conforme
					</Link>
				</div>
			</footer>
		</LandingContent>
	</>
)
