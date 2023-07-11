import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Meta from '../../components/utils/Meta'
import { useQuery } from '../../utils'

export const formStyle = `
label {
	display: block;
	margin-bottom: 1em;
}
label input, label textarea {
	display: block;
	border-radius: .3em;
	padding: .3em ;
	border: 1px solid var(--color);
	box-shadow: none;
	margin-top: .6em;
	font-size: 100%;
	width: 80%

}
label textarea {
	height: 6em;
}`

export const createIssue = (
	title,
	body,
	setURL,
	disableButton,
	labels = ['contribution externe']
) => {
	if (title == null || body == null || [title, body].includes('')) {
		return null
	}

	fetch(
		'/.netlify/functions/create-issue?' +
			Object.entries({
				repo: 'datagir/nosgestesclimat',
				title,
				body,
				labels,
			})
				.map(([k, v]) => k + '=' + encodeURIComponent(v))
				.join('&'),
		{ mode: 'cors' }
	)
		.then((response) => response.json())
		.then((json) => {
			setURL(json.url)
			disableButton(false)
		})
}

export const GithubContributionForm = () => {
	const fromLocation = useQuery().get('fromLocation')

	const [sujet, setSujet] = useState('')
	const [comment, setComment] = useState('')
	const [URL, setURL] = useState(null)
	const [buttonDisabled, disableButton] = useState(false)

	const { t } = useTranslation()
	return !URL ? (
		<form css={formStyle}>
			<label css="color: var(--color)">
				<Trans>Le titre bref de votre problème</Trans>
				<input
					aria-describedby="messageAttention"
					value={sujet}
					onChange={(e) => setSujet(e.target.value)}
					type="text"
					name="sujet"
					required
				/>
			</label>
			<label css="color: var(--color)">
				<Trans i18nKey={'publicodes.Contribution.descriptionComplète'}>
					<p>La description complète de votre problème</p>
					<p>
						<small>
							En indiquant le navigateur que vous utilisez (par exemple Firefox
							version 93, Chrome version 95, Safari, etc.), et la plateforme
							(iPhone, Android, ordinateur Windows, etc.), vous nous aiderez à
							résoudre le bug plus rapidement.
						</small>
					</p>
				</Trans>
				<textarea
					aria-describedby="messageAttention"
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					name="comment"
					required
				/>
			</label>
			<p id="messageAttention">
				<em>
					<Trans>
						Cette contribution sera publique : n'y mettez pas d'informations
						sensibles
					</Trans>
				</em>
			</p>
			<button
				className="ui__ button"
				type="submit"
				disabled={buttonDisabled}
				onClick={(e) => {
					if (buttonDisabled) return null

					e.preventDefault()
					disableButton(true)
					const augmentedComment =
						comment +
						(fromLocation
							? '\n> ' + t('Depuis la page') + ': `' + fromLocation + '`'
							: '') +
						t('publicodes.Contribution.commentaireAugmenté')
					createIssue(sujet, augmentedComment, setURL, disableButton, [
						'FAQ',
						'contribution externe',
					])
				}}
			>
				<Trans>Envoyer</Trans>
			</button>
		</form>
	) : (
		<p role="status">
			<Trans i18nKey={'publicodes.Contribution.remerciements'}>
				Merci 😍! Suivez l'avancement de votre suggestion en cliquant sur{' '}
				<a href={URL}>ce lien</a>.
			</Trans>
		</p>
	)
}

export const GithubContributionCard = () => {
	return (
		<div className="ui__ card" css="padding: 1rem 0">
			<p>
				<Trans i18nKey={'publicodes.Contribution.liensVersGithub'}>
					Pour toute remarque ou question, nous vous invitons à{' '}
					<a href="https://github.com/datagir/nosgestesclimat/issues/new?assignees=&labels=contribution&template=retour-utilisateur.md&title=">
						ouvrir un ticket directement sur GitHub
					</a>
					.
				</Trans>
			</p>
			<details>
				<summary>
					<Trans i18nKey={'publicodes.Contribution.bugQuestion'}>
						🐛 Vous avez un bug qui vous empêche d'utiliser Nos Gestes Climat ?
					</Trans>
				</summary>
				<GithubContributionForm />
			</details>
		</div>
	)
}

export default () => {
	const { t } = useTranslation()

	return (
		<div className="ui__ container" css="padding-bottom: 1rem">
			<Meta
				title={t('meta.publicodes.Contact.titre')}
				description={t('meta.publicodes.Contact.description')}
			></Meta>
			<h1>
				<Trans>Contact</Trans>
			</h1>
			<h2 css="font-size: 180%">
				🙋‍♀️{' '}
				<Trans i18nKey={'publicodes.Contact.titreQuestion'}>
					J'ai une question
				</Trans>
			</h2>
			<p>
				<Trans i18nKey={'publicodes.Contact.description'}>
					N'hésitez pas à consulter notre{' '}
					<a href="./questions-frequentes">FAQ</a> avant de nous écire, vous y
					trouverez sans doute la réponse à votre question !
				</Trans>
			</p>
			<p>
				<Trans i18nKey={'publicodes.Contact.form'}>
					Pour toute remarque ou question,{' '}
					<strong>
						nous vous recommandons{' '}
						<a href="https://github.com/datagir/nosgestesclimat/issues/new?assignees=&labels=contribution&template=retour-utilisateur.md&title=">
							d'ouvrir un ticket directement sur GitHub
						</a>
					</strong>{' '}
					afin de suivre les échanges plus facilement. Vous pouvez également
					nous envoyer un message via le formulaire de contact ci-dessous.
				</Trans>
			</p>
			<div
				className="ui__ card"
				css={`
					padding: 1rem 0;
					margin: 1rem 0;
				`}
			>
				<GithubContributionForm />
			</div>
			<p>
				<Trans i18nKey={'publicodes.Contact.mail'}>
					Enfin, vous avez la possibilité de nous envoyer un mail à l'adresse{' '}
					<a href="mailto:contact@nosgestesclimat.fr">
						contact@nosgestesclimat.fr
					</a>
					. Cependant, le délais de réponse sera plus long que les solutions
					précédentes.
				</Trans>
			</p>
		</div>
	)
}
