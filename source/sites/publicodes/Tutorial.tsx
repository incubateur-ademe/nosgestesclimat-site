import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { skipTutorial } from '../../actions/actions'
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
				src="https://raw.githubusercontent.com/laem/openmoji-environment/greenhouse/greenhouse-effect.svg"
				css="width: 10rem"
			/>
			<p>
				Ce test donne une mesure de <strong>votre part </strong> dans ce
				réchauffement, en mesurant votre <strong>consommation</strong>{' '}
				personnelle.
			</p>
		</Slide>
		<Slide index={2}>
			<h1>Ma deuxième</h1>
			<p>Pas de panique, on vous l'explique pas à pas.</p>
			<p>
				La planète se réchauffe, au fur et à mesure des gaz à effet de serre que
				l'on émet.
			</p>
			<img
				src="https://raw.githubusercontent.com/laem/openmoji-environment/greenhouse/greenhouse-effect.svg"
				css="width: 10rem"
			/>
			<p>
				Ce test donne une mesure de <strong>votre part </strong> dans ce
				réchauffement, en mesurant votre <strong>consommation</strong>{' '}
				personnelle.
			</p>
		</Slide>
	</>
)

const Slide = ({ children, index }) => {
	const dispatch = useDispatch(),
		skip = (name) => dispatch(skipTutorial(name)),
		next = () => skip('testIntro' + index),
		tutorials = useSelector((state) => state.tutorials),
		display =
			!tutorials['testIntro' + index] &&
			(index === 1 || tutorials['testIntro' + (index - 1)])
	if (!display) return null
	return (
		<animate.appear>
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
