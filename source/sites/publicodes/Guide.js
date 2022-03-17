import { Markdown } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import { utils } from 'publicodes'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import Meta from 'Components/utils/Meta'
import { useContext } from 'react'
import { EngineContext } from '../../components/utils/EngineContext'

import { splitName, title } from 'Components/publicodesUtils'

export default () => {
	const rules = useSelector((state) => state.rules)
	const guideRule = 'guide-mode-groupe'
	const rule = rules[guideRule]

	const { encodedName } = useParams()
	const titre = utils.decodeRuleName(encodedName)

	const category = encodedName.split('-')[1]

	const actionsPlus = Object.entries(rules)
		.map(([dottedName, rule]) => ({ ...rule, dottedName }))
		.filter((r) => r.plus)

	const relatedActions = actionsPlus.filter(
		(action) => category === splitName(action.dottedName)[0]
	)

	return (
		<div css="padding: 0 .3rem 1rem; max-width: 600px; margin: 1rem auto;">
			<Meta title={titre} />
			<ScrollToTop />
			<div>
				{encodedName !== 'guide' && (
					<Link to={'/groupe/guide'}>
						<button className="ui__ button simple small ">
							{emoji('◀')} Retour
						</button>
					</Link>
				)}
			</div>
			<div css="margin: 1.6rem 0">
				<Markdown
					source={rule[encodedName] || "Ce guide n'existe pas encore"}
				/>
				{encodedName !== 'guide' && relatedActions.length > 0 && (
					<>
						<p>Pour aller plus loin:</p>
						<div>
							{relatedActions.map((action) => (
								<Link
									to={
										'/actions/plus/' + utils.encodeRuleName(action.dottedName)
									}
									css="> button {margin: .3rem .6rem}"
								>
									<button className="ui__ small button">{title(action)}</button>
								</Link>
							))}
						</div>
					</>
				)}
			</div>
		</div>
	)
}
