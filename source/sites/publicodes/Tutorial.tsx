import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { skipTutorial } from '../../actions/actions'
import emoji from '../../components/emoji'
import animate from '../../components/ui/animate'

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
		<Slide index={2} delay={1.5}>
			<h1>Ça se mesure comment ?</h1>
			<p>
				L'empreinte sur le climat se mesure en une unité un peu barbare, appelée
				équivalent CO₂.{' '}
			</p>
			<p>
				Le CO₂, vous connaissez : on l'expire toute la journée... mais c'est
				aussi ce que les machines qui font notre confort moderne rejettent, en
				quantités bien plus massives, et c'est le principal gaz à effet de
				serre.{' '}
			</p>
			<img
				src="https://raw.githubusercontent.com/laem/openmoji-environment/master/co2.svg"
				css="width: 6rem"
			/>
			<blockquote>
				<p>
					{emoji('💡')}&nbsp; D'autres gaz, surtout le méthane et le dioxyde
					d'azote, réchauffent aussi la planète : on les convertit en CO₂ pour
					simplifier la mesure, d'où le "e" dans "CO₂e".
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
		<Slide index={3}>
			<h1>Ça se mesure comment ?</h1>
			<p>
				L'empreinte sur le climat se mesure en une unité un peu barbare, appelée
				équivalent CO₂.{' '}
			</p>
			<p>
				Le CO₂, vous connaissez : c'est ce qu'on rejette quand on respire...
				mais c'est aussi ce que les machines qui font notre confort moderne
				rejettent, en quantités bien plus massives.{' '}
			</p>
			<img
				src="https://raw.githubusercontent.com/laem/openmoji-environment/master/co2.svg"
				css="width: 10rem"
			/>
			<p>Et ce "équivalent", d'où vient-il ?</p>
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
