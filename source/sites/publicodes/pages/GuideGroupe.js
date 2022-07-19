import { Markdown } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import { utils } from 'publicodes'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import Meta from 'Components/utils/Meta'
import { splitName, title } from 'Components/publicodesUtils'
import styled from 'styled-components'

export default () => {
	const rules = useSelector((state) => state.rules)
	const guideRule = 'guide-mode-groupe'
	const rule = rules[guideRule]

	const { encodedName } = useParams()

	if (!encodedName) {
		return (
			<GuideWrapper>
				<Meta title={'Guide'} />
				<ScrollToTop />
				<Markdown children={rule['guide'] || "Ce guide n'existe pas encore"} />
			</GuideWrapper>
		)
	}

	const titre = utils.decodeRuleName(encodedName)
	const category = encodedName.split('-')[1]

	const actionsPlus = Object.entries(rules)
		.map(([dottedName, rule]) => ({ ...rule, dottedName }))
		.filter((r) => r.plus)

	const relatedActions = actionsPlus.filter(
		(action) => category === splitName(action.dottedName)[0]
	)

	return (
		<GuideWrapper>
			<Meta title={titre} />
			<ScrollToTop />
			<Link to={'/guide/general'}>
				<button className="ui__ button simple small ">
					{emoji('◀')} Retour
				</button>
			</Link>
			<div css="margin: 1.6rem 0">
				<Markdown
					children={rule[encodedName] || "Ce guide n'existe pas encore"}
				/>
				{encodedName !== 'guide' && relatedActions.length > 0 && (
					<>
						<h2>Pour aller plus loin:</h2>
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
		</GuideWrapper>
	)
}

const GuideWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`
