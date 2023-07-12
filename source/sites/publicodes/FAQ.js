import SearchBarFAQ from '@/components/SearchBarFAQ'
import { Markdown } from 'Components/utils/markdown'
import { useEffect } from 'react'
import { renderToString } from 'react-dom/server'
import { Trans, useTranslation } from 'react-i18next'
import Meta from '../../components/utils/Meta'
import { getCurrentLangInfos } from '../../locales/translation'
import { GithubContributionCard } from './Contact'
import { useProfileData } from './Profil'

export default () => {
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

	const { i18n } = useTranslation()
	const FAQ = getCurrentLangInfos(i18n).faqContent
	const { hasData } = useProfileData()

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
				title={t('meta.publicodes.FAQ.title')}
				description={t('meta.publicodes.FAQ.description')}
			>
				<script type="application/ld+json">
					{JSON.stringify(structuredFAQ)}
				</script>
			</Meta>
			<h1>
				<Trans>Questions fréquentes</Trans>
			</h1>
			<p>
				<Trans i18nKey={'publicodes.FAQ.description'}>
					Bienvenue sur la FAQ Nos Gestes Climat ! Vous trouverez ici les
					réponses aux questions les plus fréquentes. S’il vous reste des
					interrogations ou si vous souhaitez nous proposer des améliorations,
					rendez-vous tout en bas. Bonne lecture !
				</Trans>
			</p>
			{!hasData && (
				<p>
					<Trans i18nKey={'publicodes.FAQ.faireletest'}>
						Vous n'avez pas encore débuté votre test,{' '}
						<strong>
							<a href="./simulateur/bilan">lancez-vous !</a>
						</strong>
					</Trans>
				</p>
			)}
			<SearchBarFAQ />
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
				<Trans i18nKey={'publicodes.FAQ.titreQuestion'}>
					J'ai une autre question
				</Trans>
			</h2>
			<GithubContributionCard />
		</div>
	)
}
