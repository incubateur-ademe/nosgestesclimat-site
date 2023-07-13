import { skipTutorial } from '@/actions/actions'
import { matomoEventParcoursTestSkipTutorial } from '@/analytics/matomo-events'
import { Twemoji } from '@/components/emoji'
import ButtonLink from '@/components/groupe/ButtonLink'
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
import { Navigate } from 'react-router-dom'

export default function Tutoriel() {
	const { t } = useTranslation()
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

	return (
		<>
			<main className="p-4  h-full ">
				<Meta
					title={t('Tutoriel')}
					description={t(
						'Parcourez le tutoriel Nos Gestes Climat avant de débuter votre simulation.'
					)}
					image={generateImageLink(window.location)}
				/>
				<Title
					data-cypress-id="tutoriel-title"
					title={
						<span className="">
							<span className="text-secondary inline">
								<Trans>10 minutes</Trans>
							</span>{' '}
							<Trans>chrono pour calculer votre empreinte sur le climat</Trans>
						</span>
					}
				/>
				<Separator className="mb-14" />
				<div className="bg-grey-100 p-7 relative">
					<div
						role="presentation"
						aria-hidden
						className="absolute rounded-md -top-7 p-4 bg-grey-100 rounded-full inline-block text-3xl"
					>
						<Twemoji text="💡"></Twemoji>
					</div>
					<h3>
						<Trans>Avant de commencer</Trans>
					</h3>
					<div className=" relative pl-8">
						<h4 className="font-bold before:content-['🏡'] before:absolute before:left-0 overflow-visible ">
							<Trans>C'est un test individuel !</Trans>
						</h4>
						<p>
							<Trans>
								Répondez aux questions{' '}
								<span className="font-bold">en votre nom</span>, pas pour votre
								foyer.
							</Trans>
						</p>
					</div>
					<div className=" relative pl-8">
						<h4 className="font-bold before:content-['👤'] before:absolute before:left-0 overflow-visible ">
							<Trans>Il concerne votre vie personnelle</Trans>
						</h4>
						<p className="ml-6.5">
							<Trans>
								Pas votre boulot ou vos études. Une seule{' '}
								<span className="font-bold">exception</span> : votre trajet
								domicile-travail doit être inclus dans les km parcourus.
							</Trans>
						</p>
					</div>
				</div>
				<h5 className="mt-10 text-lg">D’autres questions ?</h5>
				<ul className="list-none p-0 mb-1">
					<li className="my-1" id={'empreinte'}>
						<details>
							<summary className=" font-bold text-primary">
								<Trans>C’est quoi mon empreinte carbone ?</Trans>
							</summary>
							<div className="ml-3.5 my-2 text-sm">
								<p>
									<Trans>
										La planète se réchauffe dangereusement, au fur et à mesure
										des gaz à effet de serre que l'on émet.
									</Trans>
								</p>
								<p>
									<Trans>
										Pas pour votre boulot ou vos études. Une seule exception :
										votre trajet domicile-travail doit être inclus dans les km
										parcourus.
									</Trans>
								</p>
							</div>
						</details>
					</li>
					<li className="my-1" id={'mesure'}>
						<details>
							<summary className=" font-bold text-primary">
								<Trans>Comment on la mesure ?</Trans>
							</summary>
							<div className="ml-3.5 my-2 text-sm">
								<p>
									<Trans>
										Avec une unité au nom barbare : l'équivalent CO₂. Le dioxyde
										de carbone, vous le connaissez : on l'expire toute la
										journée, mais sans influence sur le climat.
									</Trans>
								</p>
								<p>
									<Trans>
										Ce sont les machines qui font notre confort moderne qui en
										rejettent massivement, à tel point qu'on le compte en
										milliers de kilos par an et par personne, donc en tonnes de
										CO₂e !
									</Trans>
								</p>
							</div>
						</details>
					</li>
					<li className="my-1" id={'objectif'}>
						<details>
							<summary className=" font-bold text-primary">
								<Trans>Quel est l’objectif à atteindre ?</Trans>
							</summary>
							<div className="ml-3.5 my-2 text-sm">
								<Trans>
									<p>
										Nous devons diminuer notre empreinte climat au plus vite.
									</p>
									<p>
										En France, ça consiste à passer de ~10 tonnes à moins de 2
										tonnes par an.
									</p>
								</Trans>
								<p>
									<Trans>Pour en savoir plus, tout est expliqué dans </Trans>
									<a href="https://nosgestesclimat.fr/blog/budget">
										<Trans>cet article</Trans>
									</a>
								</p>
								&nbsp;<Trans>(15 min de lecture)</Trans>
							</div>
						</details>
					</li>
					<li className="my-1" id={'categories'}>
						<details id={'categories'}>
							<summary className=" font-bold text-primary">
								<Trans>D’où vient mon empreinte ?</Trans>
							</summary>
							<div className="ml-3.5 my-2 text-sm">
								<p>
									<Trans>
										Prendre la voiture, manger un steak, chauffer sa maison, se
										faire soigner, acheter une TV...
									</Trans>
								</p>
								<p>
									<Trans>
										L'empreinte de notre consommation individuelle, c'est la
										somme de toutes ces activités qui font notre vie moderne.
									</Trans>
								</p>
							</div>
						</details>
					</li>
				</ul>
				<ButtonLink
					href="/questions-frequentes"
					className="rounded-3xl mt-5 mb-10 border-[1px] !px-4"
					color="white"
					size="sm"
				>
					☝️ <Trans>Consultez la FAQ</Trans>
				</ButtonLink>
				<div className="bg-white w-full border-solid border-0 border-t border-gray-200 fixed h-auto sm:relative bottom-0 sm:mt-5 -m-4 right:0 left:0 py-4">
					<ButtonLink
						href="/"
						className="ml-4 border-[1px] !border-grey-200 !py-3 !px-5 !bg-grey-100 text-gray-700"
						size="md"
					>
						←
					</ButtonLink>
					<ButtonLink
						href="/simulateur/bilan"
						onClick={() => {
							trackEvent(matomoEventParcoursTestSkipTutorial)
							skip('testIntro')
						}}
						data-cypress-id="skip-tuto-button"
						className="float-right mr-4 mb-4 right-0 !py-3"
						size="md"
					>
						{t("C'est parti ! →")}
					</ButtonLink>
				</div>
			</main>
		</>
	)
}
