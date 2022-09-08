import { Markdown } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import { utils } from 'publicodes'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import Meta from 'Components/utils/Meta'
import { title } from 'Components/publicodesUtils'
import useFetchDocumentation from '../../components/useFetchDocumentation'
import { useTranslation } from 'react-i18next'

export default () => {
	const { t } = useTranslation()
	const encodedName = useParams()['*']
	const dottedName = utils.decodeRuleName(encodedName)
	const rules = useSelector((state) => state.rules)
	const documentation = useFetchDocumentation()
	if (!documentation) return null

	const rule = {
		...rules[dottedName],
		dottedName,
		plus: documentation['actions-plus/' + dottedName],
	}

	return (
		<div css="padding: 0 .3rem 1rem; max-width: 600px; margin: 1rem auto;">
			<Meta title={title(rule)} />
			<ScrollToTop />
			<div>
				<Link to={'/actions/plus'}>
					<button className="ui__ button simple small ">
						{emoji('◀')}
						<Trans>Retour à la liste des fiches</Trans>
					</button>
				</Link>
			</div>
			<Link to={'/actions/' + encodedName}>
				<button className="ui__ button simple small ">
					{emoji('🧮')}
					<Trans>Voir le geste climat correspondant</Trans>
				</button>
			</Link>
			<div css="margin: 1.6rem 0">
				<Markdown
					children={rule.plus || t(`Cette fiche détaillée n'existe pas encore`)}
				/>
			</div>
		</div>
	)
}
