import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'

export default () => (
	<>
		<Trans i18nKey={'publicodes.Tutorial.slide7'}>
			<h1>Alors, c'est parti ?</h1>
			<p>Quelques astuces pour vous aider à compléter le test :</p>
			<blockquote key="individuel">
				👤 Répondez aux questions en votre nom, pas au nom de votre foyer :
				c'est un test individuel.
			</blockquote>
			<blockquote key="perso">
				💼 Répondez pour votre vie perso, pas pour votre boulot ou études.{' '}
				<em>Une seule exception </em>: votre trajet domicile-travail doit être
				inclus dans les km parcourus.
			</blockquote>
			<blockquote key="questions">
				❓️ D'autres questions ? Consultez notre{' '}
				<Link to="/contribuer">FAQ</Link> à tout moment.
			</blockquote>
		</Trans>
	</>
)
