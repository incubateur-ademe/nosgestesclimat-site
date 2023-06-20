import { ScrollToTop } from 'Components/utils/Scroll'
import { utils } from 'publicodes'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { getTitle } from '../../components/publicodesUtils'
import useFetchDocumentation from '../../components/useFetchDocumentation'

export default () => {
	const rules = useSelector((state) => state.rules)
	const documentation = useFetchDocumentation()

	if (!documentation) return null

	const plusListe = Object.entries(rules)
		.map(([dottedName, rule]) => ({ ...rule, dottedName }))
		.map((rule) => {
			const plus = documentation['actions-plus/' + rule.dottedName]
			return { ...rule, plus }
		})

		.filter((r) => r.plus)

	return (
		<div className="ui__ container">
			<ScrollToTop />
			<h1>
				<Trans>Nos explications complètes</Trans>{' '}
				<img src="https://img.shields.io/badge/-beta-purple" />
			</h1>
			<p>
				<em>
					<Trans>
						Découvrez les enjeux qui se cachent derrière chaque action.
					</Trans>
				</em>
			</p>
			<CardGrid>
				{plusListe.map((rule) => (
					<li key={rule.dottedName}>
						<Link to={'/actions/plus/' + utils.encodeRuleName(rule.dottedName)}>
							<div
								className="ui__ card"
								css={`
									display: flex;
									flex-direction: column;
									justify-content: space-evenly;
									width: 12rem;
									@media (max-width: 800px) {
										width: 9rem;
									}
									height: 10rem;
									img {
										font-size: 150%;
									}
								`}
							>
								<div>{emoji(rule.icônes || '🎯')}</div>
								<div>{getTitle(rule)}</div>
							</div>
						</Link>
					</li>
				))}
			</CardGrid>
		</div>
	)
}

export const CardGrid = styled.ul`
	list-style-type: none;
	display: flex;
	flex-wrap: wrap;
	li {
		margin: 0.6rem;
		@media (max-width: 800px) {
			margin: 0.4rem;
		}
		text-align: center;
	}
	li > a {
		text-decoration: none;
	}

	.card {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		width: 12rem;
		@media (max-width: 800px) {
			width: 10rem;
		}
		height: 10rem;
		img {
			font-size: 150%;
		}
	}
`
