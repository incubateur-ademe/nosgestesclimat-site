import GreenhouseEffect from 'Images/greenhouse-effect.svg'
import { Trans } from 'react-i18next'

export default () => (
	<>
		<h1>
			<Trans>Mon empreinte climat 😶‍🌫️</Trans> ?
		</h1>
		<Trans i18nKey={`publicodes.Tutorial.slide1.p1`}>
			<p>Pas de panique, on vous explique ce que c'est.</p>
			<p>
				La planète <strong>se réchauffe dangereusement</strong>, au fur et à
				mesure des gaz à effet de serre que l'on émet.
			</p>
		</Trans>
		<GreenhouseEffect css="width: 60%; max-height: 20rem" />
		<Trans i18nKey={`publicodes.Tutorial.slide1.p2`}>
			<p>
				Ce test vous donne en ⏱️ 10 minutes chrono{' '}
				<strong>une mesure de votre part </strong> dans ce réchauffement.
			</p>
		</Trans>
	</>
)
