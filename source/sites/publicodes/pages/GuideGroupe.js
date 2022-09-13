import { splitName, title } from 'Components/publicodesUtils'
import { Markdown } from 'Components/utils/markdown'
import Meta from 'Components/utils/Meta'
import { ScrollToTop } from 'Components/utils/Scroll'
import { utils } from 'publicodes'
import emoji from 'react-easy-emoji'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import useFetchDocumentation from 'Components/useFetchDocumentation'

export default () => {
	const documentation = useFetchDocumentation()
	if (!documentation) return null

	const { encodedName } = useParams()

	if (!encodedName) {
		return (
			<GuideWrapper>
				<Meta title={'Guide'} />
				<ScrollToTop />
				<Markdown
					children={
						documentation['guide-mode-groupe/guide'] ||
						"Ce guide n'existe pas encore"
					}
				/>
			</GuideWrapper>
		)
	}

	const titre = utils.decodeRuleName(encodedName)
	const category = encodedName.split('-')[1]

	const actionsPlus = Object.entries(documentation)
		.filter(([key, value]) => key.startsWith('actions-plus/'))
		.map(([key, value]) => ({
			plus: value,
			dottedName: key.replace('actions-plus/', ''),
		}))

	const relatedActions = actionsPlus.filter(
		(action) => category === splitName(action.dottedName)[0]
	)

	return (
		<GuideWrapper>
			<Meta title={titre} />
			<ScrollToTop />
			<Link to={'/guide'}>
				<button className="ui__ button simple">{emoji('◀')} Retour</button>
			</Link>
			<div>
				<Markdown
					children={
						documentation['guide-mode-groupe/' + encodedName] ||
						"Ce guide n'existe pas encore"
					}
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
	padding: 0 0.3rem 1rem;
	margin: 1rem auto;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
`
