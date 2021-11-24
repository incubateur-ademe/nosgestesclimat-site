import CO2e from 'Images/CO2e'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import emoji from '../../components/emoji'
import CarbonImpact from './CarbonImpact'
import Chart from './chart/index.js'
import HorizontalSwipe from './HorizontalSwipe'
import Slide from './TutorialSlide'
import { skipTutorial } from '../../actions/actions'

export default ({}) => {
	const tutorials = useSelector((state) => state.tutorials)

	if (tutorials['testIntro']) return null
	const tutos = Object.entries(tutorials)
		.map(([k, v]) => v != null && k.split('testIntro')[1])
		.filter(Boolean)

	const index = tutos.length
	console.log('I', index, tutorials, tutos)

	const Component = slides[index]

	const dispatch = useDispatch()

	const skip = (name, unskip) => dispatch(skipTutorial(name, unskip)),
		last = index === slides.length - 1,
		next = () => skip(last ? 'testIntro' : 'testIntro' + index),
		previous = () => dispatch(skipTutorial('testIntro' + (index - 1), true))

	return (
		<div
			css={`
				height: 70vh;
				position: relative;
				display: flex;
				justify-content: center;
				align-items: center;
			`}
		>
			<HorizontalSwipe {...{ next, previous }}>
				<Slide
					{...{
						last,
						skip,
					}}
				>
					<Component />
				</Slide>
			</HorizontalSwipe>
		</div>
	)
}

const slides = [
	() => (
		<>
			<h1>Mon empreinte climat {emoji('😶‍🌫️')} ?</h1>
			<p>Pas de panique, on vous explique ce que c'est.</p>
			<p>
				La planète <strong>se réchauffe dangereusement</strong>, au fur et à
				mesure des gaz à effet de serre que l'on émet.
			</p>
			<img
				src="https://raw.githubusercontent.com/laem/openmoji-environment/master/greenhouse-effect.svg"
				css="width: 14rem"
			/>
			<p>
				Ce test vous donne en {emoji('⏱️')} 10 minutes chrono{' '}
				<strong>une mesure de votre part </strong> dans ce réchauffement.
			</p>
		</>
	),
	() => (
		<>
			<h1>Ça se mesure comment ?</h1>
			<p>Avec une unité au nom barbare : l'équivalent CO₂.</p>
			<p>
				Le dioxyde de carbone (CO₂{' '}
				<img
					src="https://raw.githubusercontent.com/laem/openmoji-environment/master/co2.svg"
					css="width: 3rem; height: 1.5rem; object-fit: cover;"
				/>
				), vous connaissez : on l'expire toute la journée... mais c'est surtout
				ce que les machines qui font notre confort moderne rejettent, en
				quantités massives.
			</p>
			<div
				css={`
					svg {
						height: 7rem;
						margin: 0.6rem auto;
						display: block;
						animation: fall 0.5s ease-in;
					}

					@keyframes fall {
						from {
							transform: translateY(-100%);
							opacity: 0;
						}
						80% {
							transform: translateY(10%);
							opacity: 1;
						}
						100% {
							transform: translateY(0%);
							opacity: 1;
						}
					}

					svg text {
						mask-size: 200%;

						mask-image: linear-gradient(
							-75deg,
							rgba(0, 0, 0, 0.6) 30%,
							#000 50%,
							rgba(0, 0, 0, 0.6) 70%
						);
						mask-size: 200%;
						animation: shine 2s linear infinite;

						@keyframes shine {
							from {
								-webkit-mask-position: 150%;
							}
							to {
								-webkit-mask-position: -50%;
							}
						}
					}
				`}
			>
				<CO2e />
			</div>
			<p>
				À tel point qu'on le compte en milliers de kilos par an et par personne,
				donc en <strong>tonnes</strong> de CO₂e !
			</p>
			<blockquote>
				<p>
					{emoji('💡')}&nbsp; Et d'où vient ce petit <em>e</em> ? D'autres gaz,
					surtout le méthane et le dioxyde d'azote, réchauffent aussi la planète
					: on les convertit en CO₂ pour simplifier la mesure.
					<img
						src="https://raw.githubusercontent.com/laem/openmoji-environment/master/methane.svg"
						css="width: 3rem"
					/>
					<img
						src="https://raw.githubusercontent.com/laem/openmoji-environment/master/no2.svg"
						css="width: 3rem"
					/>
				</p>
			</blockquote>
		</>
	),
	() => (
		<>
			<h1>Et concrètement ?</h1>
			<p>
				Chaque année, un français émet en moyenne{' '}
				<strong> à peu près 10 tonnes</strong> de CO₂e.
			</p>
			<img
				src={require('Images/abacus-france.svg').default}
				css="width:10rem"
			/>
			<p>
				C'est votre point de départ dans ce test : chaque réponse que vous
				donnerez va personnaliser ce résultat dans la barre{' '}
				<span css="@media(min-width: 800px){display: none}">
					ci-dessous {emoji('⤵️')}{' '}
				</span>
				<span css="@media(max-width: 800px){display: none}">
					ci-dessus {emoji('⤴️')}{' '}
				</span>
				.
			</p>
			<div css="margin: 1rem 0">
				<CarbonImpact demoMode />
			</div>
		</>
	),
	() => (
		<>
			<h1>Et l'objectif ?</h1>
			<p>Nous devons diminuer notre empreinte climat au plus vite.</p>
			<p>
				En France, ça consiste à passer de ~10 tonnes à{' '}
				<strong>moins de 2 tonnes</strong> par an.
			</p>
			<img
				src={require('Images/objectif-climat.svg').default}
				css="width:16rem"
			/>
			<p css="text-align: center; line-height: 1.2rem">
				<em>
					Pour en savoir plus, tout est expliqué <br />
					dans{' '}
					<a href="https://datagir.ademe.fr/blog/budget-empreinte-carbone-c-est-quoi/">
						cet article
					</a>{' '}
					(15 min de lecture)
				</em>
				.
			</p>
		</>
	),
	() => (
		<>
			<h1>D'où vient notre empreinte ?</h1>
			<p>
				Faire des km en voiture (transport), manger un steak (alimentation),
				chauffer sa maison (logement), se faire soigner (services publics),
				acheter une nouvelle télévision (numérique)...
			</p>
			<div css="margin:2rem">
				<Chart />
			</div>
			<p>
				L'empreinte de notre consommation individuelle, c'est la somme de toutes
				les activités qui font notre vie moderne.{' '}
			</p>
		</>
	),
	() => (
		<>
			<h1>Alors, c'est parti ?</h1>
			<p>Quelques astuces pour vous aider à compléter le test.</p>
			<ul>
				<li>
					{emoji('👤')}&nbsp; Répondez aux questions en votre nom, pas au nom de
					votre foyer : c'est un test individuel.
				</li>
				<li>
					{emoji('💼')}&nbsp; Répondez pour votre vie perso, pas pour votre
					boulot (ou vos études). <em>Une seule exception </em>: votre trajet
					domicile-travail doit être inclus dans les km parcourus.
				</li>
				<li>
					{emoji('❓️')}&nbsp; D'autres questions ? Consultez notre{' '}
					<Link to="/contribuer">FAQ</Link> à tout moment.
				</li>
			</ul>
		</>
	),
]
