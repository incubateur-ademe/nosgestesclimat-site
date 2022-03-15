import { Markdown } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import { utils } from 'publicodes'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import Meta from 'Components/utils/Meta'

export default () => {
	const rules = useSelector((state) => state.rules)
	const guideRule = 'guide-mode-groupe'
	const rule = rules[guideRule]

	const { encodedName } = useParams()
	const titre = utils.decodeRuleName(encodedName)

	return (
		<div css="padding: 0 .3rem 1rem; max-width: 600px; margin: 1rem auto;">
			<Meta title={titre} />
			<ScrollToTop />
			<div>
				{encodedName != 'guide' && (
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
			</div>
		</div>
	)
}
