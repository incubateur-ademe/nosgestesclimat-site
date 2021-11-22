import animate from '../../components/ui/animate'
export default ({ skip }) => (
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
			<div css="button {margin: 1rem .4rem .4rem}">
				<button
					className="ui__ button small plain"
					onClick={() => skip('testIntro1')}
				>
					Suivant
				</button>
				<button className="ui__ button small" onClick={() => skip('testIntro')}>
					Passer le tutoriel
				</button>
			</div>
		</div>
	</animate.appear>
)
