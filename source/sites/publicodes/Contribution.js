import { Markdown } from 'Components/utils/markdown'
import { useEffect, useState } from 'react'
import { renderToString } from 'react-dom/server'
import { Trans, useTranslation } from 'react-i18next'
import Meta from '../../components/utils/Meta'
import { getCurrentLangInfos } from '../../locales/translation'
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

export default ({}) => {
	useEffect(() => {
		const handleAnchor = () => {
			if (window.location.hash) {
				const anchor = decodeURI(window.location.hash.substring(1)) // Extrait l'ancre de l'URL sans le '#'
				const questionElement = document.getElementById(anchor)
				if (questionElement) {
					// Faites défiler jusqu'à la question si nécessaire
					questionElement.scrollIntoView({ behavior: 'smooth' })
					questionElement.setAttribute('open', true)
				}
			}
		}

		handleAnchor()

		document.addEventListener('DOMContentLoaded', handleAnchor)

		return () => {
			document.removeEventListener('DOMContentLoaded', handleAnchor)
		}
	}, [])

	const handleDetailsToggle = (id, open) => {
		let newURL = window.location.pathname
		if (!open) {
			newURL = window.location.pathname + `#${id}`
		}
		window.history.pushState(null, null, newURL)
	}

	const fromLocation = useQuery().get('fromLocation')

	const [sujet, setSujet] = useState('')
	const [comment, setComment] = useState('')
	const [URL, setURL] = useState(null)
	const [buttonDisabled, disableButton] = useState(false)

	const { i18n } = useTranslation()
	const FAQ = getCurrentLangInfos(i18n).faqContent

	const structuredFAQ = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: FAQ.map((element) => ({
			'@type': 'Question',
			name: element.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: renderToString(<Markdown children={element.réponse} noRouter />),
			},
		})),
	}
	const categories = FAQ.reduce(
		(memo, next) =>
			memo.includes(next.catégorie) ? memo : [...memo, next.catégorie],
		[]
	)

	const { t } = useTranslation()

	return (
		<div className="ui__ container" css="padding-bottom: 1rem">
			<Meta
				title={t('Contribuer')}
				description={t('meta.publicodes.Contribution.description')}
			>
				<script type="application/ld+json">
					{JSON.stringify(structuredFAQ)}
				</script>
			</Meta>
			<h1>
				<Trans>Questions fréquentes</Trans>
			</h1>
			<p>
				<Trans i18nKey={'publicodes.Contribution.description'}>
					Vous trouverez ici les réponses aux questions les plus fréquentes.
					S’il vous reste des interrogations ou si vous souhaitez nous proposer
					des améliorations, rendez-vous tout en bas. Bonne lecture !
				</Trans>
			</p>
			<div
				css={`
					padding-bottom: 1rem;
					li {
						list-style-type: none;
					}
					h3 {
						display: inline;
					}
					h2 {
						text-transform: uppercase;
					}
					details > div {
						margin: 1rem;
						padding: 0.6rem;
					}
				`}
			>
				{categories.map((category) => (
					<li key={category}>
						<h2>{category}</h2>
						<ul>
							{FAQ.filter((el) => el.catégorie === category).map(
								({ category, question, réponse, id }) => (
									<li key={id}>
										<details id={id}>
											<summary
												onClick={(e) =>
													handleDetailsToggle(
														id,
														e.currentTarget.parentElement.open
													)
												}
											>
												<h3>{question}</h3>
											</summary>
											<div className="ui__ card">
												<Markdown children={réponse} />
											</div>
										</details>
									</li>
								)
							)}
						</ul>
					</li>
				))}
			</div>
			<h2 css="font-size: 180%">
				🙋‍♀️
				<Trans i18nKey={'publicodes.Contribution.titreQuestion'}>
					J'ai une autre question
				</Trans>
			</h2>
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
							🐛 Vous avez un bug qui vous empêche d'utiliser Nos Gestes Climat
							?
						</Trans>
					</summary>

					{!URL ? (
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
											En indiquant le navigateur que vous utilisez (par exemple
											Firefox version 93, Chrome version 95, Safari, etc.), et
											la plateforme (iPhone, Android, ordinateur Windows, etc.),
											vous nous aiderez à résoudre le bug plus rapidement.
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
										Cette contribution sera publique : n'y mettez pas
										d'informations sensibles
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
											? '\n> ' +
											  t('Depuis la page') +
											  ': `' +
											  fromLocation +
											  '`'
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
								Merci 😍! Suivez l'avancement de votre suggestion en cliquant
								sur <a href={URL}>ce lien</a>.
							</Trans>
						</p>
					)}
				</details>
			</div>
		</div>
	)
}
