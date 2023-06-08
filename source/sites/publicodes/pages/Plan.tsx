import { title } from '@/components/publicodesUtils'
import '@/components/ui/index.css'
import { RootState } from '@/reducers/rootReducer'
import Engine, { utils } from 'publicodes'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import useActions from '../useActions'

const appURL =
	process.env.NODE_ENV === 'development'
		? 'http://localhost:8080'
		: 'https://nosgestesclimat.fr'

const links = {
	'Nos outils': {
		'publicodes.planDuSite.bilan': `${appURL}/simulateur/bilan`,
		'publicodes.planDuSite.groupe': `${appURL}/groupe`,
		'publicodes.planDuSite.profil': `${appURL}/profil`,
		'publicodes.planDuSite.personas': `${appURL}/personas`,
		'publicodes.planDuSite.actions': `${appURL}/actions`,
		'publicodes.planDuSite.actionsPlus': `${appURL}/actions/plus`,
	},
	Informations: {
		'publicodes.planDuSite.nouveautes': `${appURL}/nouveautes`,
		'publicodes.planDuSite.aPropos': `${appURL}/a-propos`,
		'publicodes.planDuSite.viePrivee': `${appURL}/vie-privee`,
		'publicodes.planDuSite.partenaires': `${appURL}/partenaires`,
		'publicodes.planDuSite.contribuer': `${appURL}/contribuer`,
		'publicodes.planDuSite.stats': `${appURL}/stats`,
		Blog: `${appURL}/blog`,
	},
	Documentations: {
		'publicodes.planDuSite.guide': `${appURL}/guide`,
		'publicodes.planDuSite.sondageDoc': `${appURL}/groupe/documentation-contexte`,
		'publicodes.planDuSite.methodologie': `${appURL}/methodologie`,
		'publicodes.planDuSite.modele': `${appURL}/modele`,
		'publicodes.planDuSite.petroleEtGaz': `${appURL}/petrole-et-gaz`,
		'publicodes.planDuSite.documentation': `${appURL}/documentation`,
	},
}

const PlanDuSite = () => {
	const rules = useSelector((state: RootState) => state.rules)
	const engine = new Engine(rules)

	const { rawActionsList } = useActions({
		focusedAction: null,
		rules,
		radical: true,
		engine,
		metric: null,
	})

	return (
		<Container>
			<Title>
				<Trans i18nKey="publicodes.planDuSite.title">Plan du site</Trans>
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
				<List>
					{rawActionsList.map((action) => {
						return (
							<li key={action.dottedName}>
								<Link
									to={`${appURL}/actions/${utils.encodeRuleName(
										action.dottedName
									)}`}
								>
									{title(action)}
								</Link>
							</li>
						)
					})}
				</List>
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
`

export default PlanDuSite
