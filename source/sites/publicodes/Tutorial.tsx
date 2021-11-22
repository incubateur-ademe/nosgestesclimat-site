import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { skipTutorial } from '../../actions/actions'
import emoji from '../../components/emoji'
import animate from '../../components/ui/animate'
import Chart from './chart/index.js'

export default ({}) => (
	<>
		<Slide index={1}>
			<h1>Mon empreinte climat ?</h1>
			<p>Pas de panique, on vous l'explique pas à pas.</p>
			<p>
				La planète se réchauffe, au fur et à mesure des gaz à effet de serre que
				l'on émet.
			</p>
			<img
				src="https://raw.githubusercontent.com/laem/openmoji-environment/master/greenhouse-effect.svg"
				css="width: 12rem"
			/>
			<p>
				Ce test donne une mesure de <strong>votre part </strong> dans ce
				réchauffement, en mesurant votre <strong>consommation</strong>{' '}
				personnelle.
			</p>
		</Slide>
		<Slide index={2}>
			<h1>Ça se mesure comment ?</h1>
			<p>
				On utilise une unité au nom barbare : l'équivalent CO₂. Mais pas de
				panique !
			</p>
			<p>Le CO₂, vous connaissez : on l'expire toute la journée... </p>
			<img
				src="https://raw.githubusercontent.com/laem/openmoji-environment/master/co2.svg"
				css="width: 6rem"
			/>
			<p>
				... mais c'est aussi ce que les machines qui font notre confort moderne
				rejettent, en quantités bien plus massives, à tel point qu'on le compte
				en milliers de kilos par an, donc en <strong>tonnes</strong> de CO₂e !
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
		<Slide index={3} delay={1.5}>
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
	</>
)

const Slide = ({ children, index, delay = 0 }) => {
	const dispatch = useDispatch(),
		skip = (name) => dispatch(skipTutorial(name)),
		next = () => skip('testIntro' + index),
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
				<div css="button {margin: 1rem .4rem .4rem}">
					<button className="ui__ button small plain" onClick={next}>
						{index ? 'Suivant' : "C'est parti"}
					</button>
					{index && (
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
