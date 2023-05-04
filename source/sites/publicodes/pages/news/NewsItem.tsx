import { localStorageKey } from 'Components/NewsBanner'
import { MarkdownWithAnchorLinks } from 'Components/utils/markdown'
import Meta from 'Components/utils/Meta'
import { usePersistingState } from 'Components/utils/persistState'
import { ScrollToTop } from 'Components/utils/Scroll'
import { useEffect } from 'react'
import emoji from 'react-easy-emoji'
import { useTranslation } from 'react-i18next'
import {
	Link,
	Navigate,
	NavLink,
	useMatch,
	useNavigate,
} from 'react-router-dom'
import { getCurrentLangInfos, Release } from 'Source/locales/translation'
import { capitalise0 } from 'Source/utils'
import styled from 'styled-components'

export const dateCool = (date: Date, abrvLocale: string) =>
	date.toLocaleString(abrvLocale, {
		year: 'numeric',
		month: 'long',
	})

const slugify = (name: string) => name.toLowerCase().replace(' ', '-')

export const sortReleases = (releases) =>
	releases
		?.filter((release) => release.published_at)
		.sort(
			(r1: Release, r2: Release) =>
				-1 * r1.published_at.localeCompare(r2.published_at)
		)

export const getPath = (index: number, data: Array<Object>) => {
	return `${'/nouveautés'}/${slugify(data[index]?.name)}`
}

export const extractImage = (body) =>
	body.match(/!\[.*?\]\((.*?)\)/)[1] || '/images/petit-logo@2x.png'

export default function NewsItem() {
	const { t, i18n } = useTranslation()
	const currentLangInfos = getCurrentLangInfos(i18n)
	const [, setLastViewedRelease] = usePersistingState(localStorageKey, null)
	const navigate = useNavigate()
	const slug = useMatch(`${encodeURIComponent('nouveautés')}/:slug`)?.params
		?.slug

	const data = sortReleases(currentLangInfos.releases),
		lastRelease = data && data[0]

	console.log(data)

	useEffect(() => {
		setLastViewedRelease(lastRelease.name)
	}, [])

	if (!data) {
		return null
	}

	const selectedRelease = data.findIndex(({ name }) => slugify(name) === slug)

	if (!slug || selectedRelease === -1) {
		return <Navigate to={getPath(0, data)} replace />
	}

	const releaseName = data[selectedRelease].name.toLowerCase()
	const body = data[selectedRelease].body

	const image = extractImage(body)

	const releaseDateCool = dateCool(
		new Date(data[selectedRelease].published_at),
		currentLangInfos.abrvLocale
	)
	return (
		<div
			css={`
				padding: 0 0.6rem;
				margin: 0 auto;
			`}
		>
			<Meta
				title={`${t(`Nouveautés`)} ${releaseDateCool} - ${capitalise0(
					releaseName
				)}`}
				image={image}
			/>
			<ScrollToTop key={selectedRelease} />
			<label title={t('titre de la version')}>
				<SmallScreenSelect
					value={selectedRelease}
					onChange={(evt) => {
						console.log('evt:', evt)
						console.log('target:', evt.target)
						navigate(getPath(Number(evt.target.value), data))
					}}
				>
					{data.map(({ name }, index) => (
						<option key={index} value={index}>
							{name}
						</option>
					))}
				</SmallScreenSelect>
			</label>
			<NewsSection>
				<Sidebar>
					{data.map(({ name, published_at: date }, index) => (
						<li key={name}>
							<NavLink activeClassName="active" to={getPath(index, data)}>
								{name}
								<div>
									<small>
										{dateCool(new Date(date), currentLangInfos.abrvLocale)}
									</small>
								</div>
							</NavLink>
						</li>
					))}
				</Sidebar>
				<MainBlock>
					<h1>{capitalise0(releaseName)}</h1>
					<MarkdownWithAnchorLinks
						children={body}
						escapeHtml={false}
						renderers={{ text: TextRenderer }}
					/>
					<NavigationButtons>
						{selectedRelease + 1 < data.length ? (
							<Link to={getPath(selectedRelease + 1, data)}>
								← {data[selectedRelease + 1].name}
							</Link>
						) : (
							<span /> // For spacing
						)}
						{selectedRelease > 0 && (
							<Link to={getPath(selectedRelease - 1, data)}>
								{data[selectedRelease - 1].name} →
							</Link>
						)}
					</NavigationButtons>
				</MainBlock>
			</NewsSection>
		</div>
	)
}

const removeGithubIssuesReferences = (text: string) =>
	text.replace(/#[0-9]{1,5}/g, '')

const TextRenderer = ({ children }: { children: string }) => (
	<>{emoji(removeGithubIssuesReferences(children))}</>
)

const NewsSection = styled.section`
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
`

const Sidebar = styled.ul`
	width: 12rem;
	display: flex;
	flex-direction: column;
	position: sticky;
	top: 20px;
	margin-right: 25px;
	padding-left: 0;
	font-size: 0.9em;
	border-right: 1px solid var(--lighterColor);

	@media (max-width: 700px) {
		display: none;
	}

	li {
		list-style-type: none;
		list-style-position: inside;
		padding: 0;
		margin: 0;

		a {
			display: block;
			color: inherit;
			text-decoration: none;
			padding: 4px 10px;
			margin: 0;

			&.active {
				background: var(--darkColor);
				color: var(--textColor) !important;
			}
			:hover:not(.active) {
				color: var(--darkerColor);
				background: var(--lightestColor);
			}
			&.active small {
				color: var(--textColor);
			}

			&.active {
				font-weight: bold;
			}
		}
	}
`

const SmallScreenSelect = styled.select`
	display: none;

	@media (max-width: 700px) {
		display: initial;
	}
`

const MainBlock = styled.div`
	flex: 1;

	> h1:first-child,
	h2:first-child,
	h3:first-child {
		margin-top: 0px;
	}
	max-width: 800px;
`

const NavigationButtons = styled.div`
	display: flex;
	justify-content: space-between;
	margin-top: 40px;

	a {
		cursor: pointer;
		background: var(--lightestColor);
		padding: 20px 30px;
	}
`
