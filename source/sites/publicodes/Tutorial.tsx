import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { skipTutorial } from '../../actions/actions'
import emoji from '../../components/emoji'
import animate from '../../components/ui/animate'
import CarbonImpact from './CarbonImpact'
import Chart from './chart/index.js'
import { Link } from 'react-router-dom'

export default ({}) => (
	<>
		<Slide index={1}>
			<h1>Mon empreinte climat {emoji('😶‍🌫️')} ?</h1>
			<p>Pas de panique, on vous explique ce que c'est.</p>
			<p>
				La planète <strong>se réchauffe dangereusement</strong>, au fur et à
				mesure des gaz à effet de serre que l'on émet.
			</p>
			<img
				src="https://raw.githubusercontent.com/laem/openmoji-environment/master/greenhouse-effect.svg"
				css="width: 12rem"
			/>
			<p>
				Ce test vous donnera, en {emoji('⏱️')} 10 minutes chrono,{' '}
				<strong>une mesure de votre part </strong> dans ce réchauffement.
			</p>
		</Slide>
		<Slide index={2}>
			<h1>Ça se mesure comment ?</h1>
			<p>On utilise une unité au nom barbare : l'équivalent CO₂.</p>
			<p>
				Le dioxyde de carbone (CO₂), vous connaissez : on l'expire toute la
				journée...{' '}
			</p>
			<img
				src="https://raw.githubusercontent.com/laem/openmoji-environment/master/co2.svg"
				css="width: 6rem"
			/>
			<p>
				... mais c'est aussi ce que les machines qui font notre confort moderne
				rejettent, en quantités bien plus massives, à tel point qu'on les compte
				en milliers de kilos par an et par personne, donc en{' '}
				<strong>tonnes</strong> de CO₂e !
			</p>
			<blockquote>
				<p>
					{emoji('💡')}&nbsp; D'autres gaz, surtout le méthane et le dioxyde
					d'azote, réchauffent aussi la planète : on les convertit en CO₂ pour
					simplifier la mesure, d'où le <em>e</em> dans "CO₂e".
				</p>
				<div
					css={`
						display: flex;
						justify-content: center;
						img {
							display: inline;
						}
					`}
				>
					<img
						src="https://raw.githubusercontent.com/laem/openmoji-environment/master/no2.svg"
						css="3rem"
					/>
					<img
						src="https://raw.githubusercontent.com/laem/openmoji-environment/master/methane.svg"
						css="3rem"
					/>
				</div>
			</blockquote>
		</Slide>
		<Slide index={3} delay={0}>
			<h1>Et concrètement ?</h1>
			<p>
				Chaque année, un français émet en moyenne{' '}
				<strong> à peu près 10 tonnes</strong>.
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
		</Slide>
		<Slide index={4} delay={0}>
			<h1>Et l'objectif ?</h1>
			<p>Nous devons diminiuer notre empreinte climat au plus vite.</p>
			<p>
				En France, ça consiste donc à passer de ~10 tonnes à{' '}
				<strong>moins de 2 tonnes</strong> par an.
			</p>
			<img
				src={require('Images/objectif-climat.svg').default}
				css="width:16rem"
			/>
			<p>
				<em>
					Pour en savoir plus, tout est expliqué dans{' '}
					<a href="https://datagir.ademe.fr/blog/budget-empreinte-carbone-c-est-quoi/">
						cet article
					</a>{' '}
					(15 min de lecture)
				</em>
				.
			</p>
		</Slide>
		<Slide index={5} delay={0}>
			<h1>D'où vient cette empreinte ?</h1>
			<p>
				Faire des kilomètres en voiture (transport), manger un steak
				(alimentation), chauffer sa maison (logement), se faire soigner
				(services publics), acheter une nouvelle télévision (numérique)...
			</p>
			<div css="margin:2rem">
				<Chart />
			</div>
			<p>
				L'empreinte de notre consommation individuelle, c'est la somme de toutes
				les activités qui font notre vie moderne.{' '}
			</p>
		</Slide>
		<Slide index={6} delay={0} last>
			<h1>Alors, c'est parti ?</h1>
			<p>Quelques astuces pour vous aider à compléter le test.</p>
			<ul>
				<li>
					{emoji('👤')}&nbsp; Répondez aux questions en votre nom, pas au nom de
					votre foyer : c'est un test individuel.
				</li>
				<li>
					{emoji('💼')}&nbsp; Répondez pour votre vie perso, pas pour votre
					boulot (ou vos études). Une seule exception : votre trajet
					domicile-travail doit être inclus dans les kilomètres parcourus.
				</li>
				<li>
					{emoji('❓️')}&nbsp; D'autres questions ? Consultez notre{' '}
					<Link to="/contribuer">FAQ</Link> à tout moment.
				</li>
			</ul>
		</Slide>
	</>
)

const Slide = ({ children, index, last, delay = 0 }) => {
	const dispatch = useDispatch(),
		skip = (name, unskip) => dispatch(skipTutorial(name, unskip)),
		next = () => skip(last ? 'testIntro' : 'testIntro' + index),
		previous = () => dispatch(skipTutorial('testIntro' + (index - 1), true)),
		tutorials = useSelector((state) => state.tutorials),
		display =
			!tutorials['testIntro' + index] &&
			(index === 1 || tutorials['testIntro' + (index - 1)])
	if (!display) return null
	return (
		<animate.appear delay={delay}>
			<div
				className="ui__ card light colored content"
				css={`
					margin-top: 1.6rem;
					img {
						margin: 0.4rem auto;
						display: block;
					}
				`}
			>
				{children}
				<div
					css={`
						display: flex;
						justify-content: end;
						align-items: center;
						margin: 2rem 0 0.6rem;
						button {
							margin: 0 0.6rem !important;
						}
					`}
				>
					{index > 1 && (
						<button className="ui__ link-button small" onClick={previous}>
							Précédent
						</button>
					)}
					<button className="ui__ button small plain" onClick={next}>
						{!last ? 'Suivant' : "C'est parti"}
					</button>
					{!last && (
						<button
							className="ui__ button small"
							onClick={() => skip('testIntro')}
						>
							Passer le tutoriel
						</button>
					)}
				</div>
			</div>
		</animate.appear>
	)
}
