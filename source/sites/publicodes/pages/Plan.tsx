import 'Components/ui/index.css'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const links = {
	Outils: {
		'publicodes.planDuSite.bilan':
			'https://nosgestesclimat.fr/simulateur/bilan',
		'publicodes.planDuSite.groupe': 'https://nosgestesclimat.fr/groupe',
		'publicodes.planDuSite.profil': 'https://nosgestesclimat.fr/profil',
		'publicodes.planDuSite.personas': 'https://nosgestesclimat.fr/personas',
		'publicodes.planDuSite.actions': 'https://nosgestesclimat.fr/actions',
		'publicodes.planDuSite.actionsPlus':
			'https://nosgestesclimat.fr/actions/plus',
	},
	Informations: {
		'publicodes.planDuSite.nouveautes': 'https://nosgestesclimat.fr/nouveautes',
		'publicodes.planDuSite.aPropos': 'https://nosgestesclimat.fr/a-propos',
		'publicodes.planDuSite.viePrivee': 'https://nosgestesclimat.fr/vie-privee',
		'publicodes.planDuSite.partenaires':
			'https://nosgestesclimat.fr/partenaires',
		'publicodes.planDuSite.contribuer': 'https://nosgestesclimat.fr/contribuer',
		'publicodes.planDuSite.stats': 'https://nosgestesclimat.fr/stats',
	},
	Documentations: {
		'publicodes.planDuSite.methodologie':
			'https://nosgestesclimat.fr/methodologie',
		'publicodes.planDuSite.modele': 'https://nosgestesclimat.fr/modele',
		'publicodes.planDuSite.petroleEtGaz':
			'https://nosgestesclimat.fr/petrole-et-gaz',
		'publicodes.planDuSite.documentation':
			'https://nosgestesclimat.fr/documentation',
	},
}

const actionsList = [
	"/actions/transport/arrêter-l'avion",
	"/actions/transport/arrêter-l'avion-court",
	"/actions/transport/prendre-moins-l'avion",
	'/actions/alimentation/réduire-viande/par-deux',
	'/actions/alimentation/réduire-viande/par-quatre',
	'/actions/alimentation/devenir-végétarien',
	'/actions/alimentation/devenir-végétalien',
	'/actions/alimentation/viande-faible-empreinte',
	'/actions/alimentation/manger-de-saison',
	'/actions/alimentation/boisson/eau-en-bouteille/arrêter',
	'/actions/alimentation/manger-local',
	'/actions/alimentation/déchets/réduire-gaspillage',
	'/actions/alimentation/déchets/composter',
	'/actions/logement/éteindre-appareils',
	'/actions/logement/remplacer-fioul-par-bois',
	'/actions/logement/remplacer-gaz-par-PAC',
	'/actions/logement/séchage-air-libre',
	'/actions/transport/éco‑conduite',
	'/actions/logement/baisse-température',
	'/actions/logement/éclairage/LED',
	'/actions/logement/rénovation-énergétique',
	'/actions/logement/rénovation-énergétique-BBC',
	'/actions/logement/raccordement-réseau-de-chaleur',
	'/actions/transport/boulot/covoiturage',
	'/actions/transport/boulot/commun',
	'/actions/transport/boulot/télétravail',
	'/actions/transport/covoiturage',
	'/actions/transport/voiture-5km',
	'/actions/transport/voiture-électrique',
	'/actions/transport/voiture/limitation-autoroute',
	'/actions/divers/numérique/internet/diminuer',
	'/actions/divers/partage-NGC',
	'/actions/divers/aider-les-autres',
	'/actions/divers/électroménager/allongement',
	'/actions/divers/ameublement/allongement',
	'/actions/services-sociétaux/voter',
	'/actions/services-sociétaux/pression-locale',
	'/actions/divers/publicité',
	'/actions/divers/avoir-un-stop-pub',
	'/actions/divers/numérique/appareils/allongement',
]

const PlanDuSite = () => {
	return (
		<Container>
			<Title>
				<Trans i18nKey="publicodes.planDuSite.title">Plan</Trans>
			</Title>
			{Object.entries(links).map(([categoryTitle, categoryLinks]) => (
				<Section key={categoryTitle}>
					<SectionTitle>
						<Trans i18nKey={`${categoryTitle}`}>{categoryTitle}</Trans>
					</SectionTitle>
					<List>
						{Object.entries(categoryLinks).map(([linkKey, linkUrl]) => (
							<li key={linkKey}>
								<Link to={linkUrl}>
									<Trans i18nKey={`${linkKey}`}>{linkKey}</Trans>
								</Link>
							</li>
						))}
					</List>
				</Section>
			))}
			<Section>
				<SectionTitle>
					<Trans i18nKey={`publicodes.planDuSite.actionsPlus`}>
						Les actions
					</Trans>
				</SectionTitle>
				{actionsList.map((link) => (
					<li key={link}>
						<Link to={link}>
							<Trans i18nKey={`${link}`}>
								{decodeURI(link.replace('/actions/', ''))}
							</Trans>
						</Link>
					</li>
				))}
			</Section>
		</Container>
	)
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	padding: 40px 20px;
`

const Title = styled.h1`
	font-size: 2rem;
	margin-bottom: 30px;
	text-align: center;
`

const Section = styled.div`
	margin-bottom: 5px;
`

const SectionTitle = styled.h2`
	font-size: 1.5rem;
	margin-bottom: 20px;
`

const List = styled.ul`
	list-style: none;
	margin: 0;
	padding: 0;

	li {
		margin-bottom: 10px;
	}

	a {
		color: #666;
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}
`

export default PlanDuSite
