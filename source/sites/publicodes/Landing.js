import LogoADEME from 'Images/LogoADEME'
import { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import NewsBanner from '../../components/NewsBanner'
import { openmojiURL } from '../../components/SessionBar'
import { TrackerContext } from '../../components/utils/withTracker'
import DocumentationButton from './DocumentationButton'
import Illustration from './images/ecolab-climat-dessin.svg'
import Marianne from './images/Marianne.svg'
import { useProfileData } from './Profil'
import animate from 'Components/ui/animate'

export default () => {
	const tracker = useContext(TrackerContext)
	return (
		<div
			css={`
				max-width: 850px;
				margin: 0 auto;
				border-radius: 1rem;
				padding: 0.4rem;
				h1 {
					margin-top: 0.3rem;
					font-size: 140%;
					line-height: 1.2em;
				}
				> div > a {
				}
				text-align: center;
				display: flex;
				flex-direction: column;
				justify-content: space-evenly;
				align-items: center;
				min-height: 85vh;
				footer {
					margin-top: auto;
				}
			`}
		>
			<h1>Connaissez-vous votre empreinte sur le climat ?</h1>
			<Illustration
				css={`
					width: 60%;
					height: auto;
					border-radius: 0.8rem;
					@media (max-width: 800px) {
						width: 95%;
					}
				`}
				alt="Illustration sur fond mauve d'une scène mélant grande ville, péri-urbain et rural, où on peut voir quelques éléments d'une vie quotidienne, chaque élément étant émetteur d'une certaine empreinte sur le climat."
			/>
			<div css="margin: 1rem 0">
				<div>
					<Link
						to="/simulateur/bilan"
						className="ui__ plain button cta"
						onClick={() =>
							tracker.push(['trackEvent', 'NGC', 'Clic CTA accueil'])
						}
					>
						Faire le test
					</Link>
				</div>
				<div>
					<Link to="/conférence" className="ui__ button small">
						{emoji('👥')} Faire le test à plusieurs
					</Link>
				</div>
				<NewsBanner />
			</div>

			<footer>
				<div
					css={`
						display: flex;
						align-items: center;
						justify-content: center;
						margin-bottom: 1rem;
						img {
							margin: 0 0.6rem;
						}
					`}
				>
					<Marianne
						css="height: 6rem; margin-right: .6rem"
						alt="Logo Marianne de la République Française"
					/>
					<a href="https://ademe.fr">
						<LogoADEME />
					</a>
					<a href="https://www.associationbilancarbone.fr/">
						<img
							css="height: 2.5rem"
							src="https://www.associationbilancarbone.fr/wp-content/themes/abc/assets/images/brand/abc_main_logo.svg"
							alt="Logo de l'Association Bilan Carbone"
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
					<ProfileLink />
				</div>
			</footer>
		</div>
	)
}

const ProfileLink = () => {
	const { hasData } = useProfileData()
	if (!hasData) return null
	return (
		<animate.fromTop delay="1">
			<div
				css={`
					button {
						padding: 0 0.2rem !important;
						border-radius: 1rem !important;
					}
				`}
			>
				<Link to="/profil">
					<button className="ui__ button plain small" title="Mon profil">
						<img
							src={openmojiURL('profile')}
							css="width: 2rem; filter: invert(1)"
						/>
					</button>
				</Link>
			</div>
		</animate.fromTop>
	)
}
