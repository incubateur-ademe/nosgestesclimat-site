/* eslint-disable react-hooks/rules-of-hooks */
import { skipTutorial } from '@/actions/actions'
import { matomoEventParcoursTestSkipTutorial } from '@/analytics/matomo-events'
import { Twemoji } from '@/components/emoji'
import ButtonLink from '@/components/groupe/ButtonLink'
import GoBackLink from '@/components/groupe/GoBackLink'
import Separator from '@/components/groupe/Separator'
import Title from '@/components/groupe/Title'
import { MODEL_ROOT_RULE_NAME } from '@/components/publicodesUtils'

import Meta from '@/components/utils/Meta'
import { useMatomo } from '@/contexts/MatomoContext'
import useKeypress from '@/hooks/useKeyPress'
import { AppState } from '@/reducers/rootReducer'
import { generateImageLink } from '@/sites/publicodes/fin'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'

export default function Tutoriel() {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const urlParams = new URLSearchParams(window.location.search)

	const fromRuleURLParam = urlParams.get('fromRuleURL')

	const targetUrl = fromRuleURLParam
		? fromRuleURLParam
		: `/simulateur/${MODEL_ROOT_RULE_NAME}`

	if (fromRuleURLParam) {
		// The tutorial is skipped when redirected from a specific rule URL
		// (e.g. /simulateur/bilan/logement/chauffage)
		// [tutorials.fromRule = 'skip']
		dispatch(skipTutorial('testIntro', false, 'skip'))
		return <Navigate to={targetUrl} replace />
	}

	const tutorials = useSelector((state: AppState) => state.tutorials)
	const tutos = Object.entries(tutorials)
		.map(([k, v]) => v != null && k.split('testIntro')[1])
		.filter(Boolean)

	const { trackEvent } = useMatomo()

	const skip = (name: string, unskip = false) =>
		dispatch(
			skipTutorial(
				name,
				unskip,
				tutorials.fromRule == 'skip'
					? // Returning to 'simulateur/bilan' after skipping the tutorial from a
					  // specific rule URL
					  'done'
					: tutorials.fromRule
			)
		)

	useKeypress('Escape', false, () => skip('testIntro'), 'keyup', [])

	const title = 'Tutorial'
	const description =
		'Parcourez le tutoriel Nos Gestes Climat avant de débuter votre simulation.'
	return (
		<>
			<main className="p-4  h-full ">
				<Meta
					title={title}
					description={description}
					image={generateImageLink(window.location)}
				/>
				<Title
					data-cypress-id="tutoriel-title"
					title={
						<span className="">
							<span className="text-primary inline">10 minutes</span> chrono
							pour calculer votre empreinte sur le climat
						</span>
					}
				/>
				<Separator className="mb-12" />
				<div className="bg-grey-100 p-7 relative">
					<div
						role="presentation"
						aria-hidden
						className="absolute -top-7 p-4 bg-grey-100 rounded-full inline-block text-3xl"
					>
						<Twemoji text="💡"></Twemoji>
					</div>
					<h3>Avant de commencer</h3>
					<div className=" relative pl-8">
						<h4 className="font-bold before:content-['🏡'] before:absolute before:left-0 overflow-visible ">
							C'est un test individuel !
						</h4>
						<p>
							Répondez aux questions{' '}
							<span className="font-bold">en votre nom</span>, pas pour votre
							foyer.
						</p>
					</div>
					<div className=" relative pl-8">
						<h4 className="font-bold before:content-['👤'] before:absolute before:left-0 overflow-visible ">
							Il concerne votre vie personnelle
						</h4>
						<p className="ml-6.5">
							Pas votre boulot ou vos études. Une seule{' '}
							<span className="font-bold">exception</span> : votre trajet
							domicile-travail doit être inclus dans les km parcourus.
						</p>
					</div>
				</div>
				<h5 className="mt-10 text-lg">D’autres questions ?</h5>
				<ul className="list-none p-0 mb-1">
					<li className="my-1" id={'empreinte'}>
						<details>
							<summary className=" font-bold text-primary">
								C’est quoi mon empreinte carbone ?
							</summary>
							<div className="ml-3.5 my-2">
								<p>
									La planète se réchauffe dangereusement, au fur et à mesure des
									gaz à effet de serre que l'on émet.
								</p>
								<p>
									Pas pour votre boulot ou vos études. Une seule exception :
									votre trajet domicile-travail doit être inclus dans les km
									parcourus.
								</p>
							</div>
						</details>
					</li>
					<li className="my-1" id={'mesure'}>
						<details>
							<summary className=" font-bold text-primary">
								Comment on la mesure ?
							</summary>
							<div className="ml-3.5 my-2">
								<Trans i18nKey={'publicodes.Tutorial.slide2.p1'}>
									Avec une unité au nom barbare : l'équivalent CO₂. Le dioxyde
									de carbone , vous le connaissez : on l'expire toute la
									journée, mais sans influence sur le climat.
								</Trans>
								<Trans i18nKey={'publicodes.Tutorial.slide2.p2'}>
									Ce sont les machines qui font notre confort moderne qui en
									rejettent massivement, à tel point qu'on le compte en milliers
									de kilos par an et par personne, donc en{' '}
									<strong>tonnes</strong> de CO₂e !
								</Trans>
							</div>
						</details>
					</li>
					<li className="my-1" id={'objectif'}>
						<details>
							<summary className=" font-bold text-primary">
								Quel est l’objectif à atteindre ?
							</summary>
							<div className="ml-3.5 my-2">
								<Trans i18nKey={'publicodes.Tutorial.slide5.p1'}>
									<p>
										Nous devons diminuer notre empreinte climat au plus vite.
									</p>
									<p>
										En France, ça consiste à passer de ~10 tonnes à{' '}
										<strong>moins de 2 tonnes</strong> par an.
									</p>
								</Trans>
								<Trans>Pour en savoir plus, tout est expliqué dans </Trans>
								<a href="https://datagir.ademe.fr/blog/budget-empreinte-carbone-c-est-quoi/">
									<Trans>cet article</Trans>
								</a>{' '}
								<Trans>(15 min de lecture)</Trans>
							</div>
						</details>
					</li>
					<li className="my-1" id={'categories'}>
						<details id={'categories'}>
							<summary className=" font-bold text-primary">
								D’où vient mon empreinte ?
							</summary>
							<div className="ml-3.5 my-2">
								<Trans i18nKey={'publicodes.Tutorial.slide6'}>
									<p>
										Prendre la voiture, manger un steak, chauffer sa maison, se
										faire soigner, acheter une TV...
									</p>
									<p>
										L'empreinte de notre consommation individuelle, c'est la
										somme de toutes ces activités qui font notre vie moderne.{' '}
									</p>
								</Trans>
							</div>
						</details>
					</li>
				</ul>
				<ButtonLink
					href="/contribuer"
					className="rounded-full mt-5 mb-10"
					color="white"
					size="sm"
				>
					☝️ Consultez la FAQ
				</ButtonLink>
				<div className="bg-white w-full border-solid border-0 border-t border-gray-200 fixed h-auto sm:relative bottom-0 sm:mt-5 -m-4 right:0 left:0 py-4">
					<GoBackLink className="mb-4 font-bold mt-3 ml-4" />

					<ButtonLink
						href="/simulateur/bilan"
						onClick={() => {
							trackEvent(matomoEventParcoursTestSkipTutorial)
							skip('testIntro')
						}}
						data-cypress-id="skip-tuto-button"
						className="float-right mr-4 right-0"
						size="md"
					>
						{t("C'est parti ! →")}
					</ButtonLink>
				</div>
			</main>
		</>
	)
}
