import { determinant } from 'Components/NewsBanner'
import { MarkdownWithAnchorLinks } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import { useEffect } from 'react'
import emoji from 'react-easy-emoji'
import { Trans, useTranslation } from 'react-i18next'
import {
	Link,
	Navigate,
	NavLink,
	useMatch,
	useNavigate,
} from 'react-router-dom'
import styled from 'styled-components'
import { localStorageKey } from '../components/NewsBanner'
import Meta from '../components/utils/Meta'
import { usePersistingState } from '../components/utils/persistState'
import { getCurrentLangInfos, Release } from '../locales/translation'

const dateCool = (date: Date, abrvLocale: string) =>
	date.toLocaleString(abrvLocale, {
		year: 'numeric',
		month: 'long',
	})

const slugify = (name: string) => name.toLowerCase().replace(' ', '-')

export const sortReleases = (releases) =>
	releases?.sort(
		(r1: Release, r2: Release) =>
			-1 * r1.published_at.localeCompare(r2.published_at)
	)

export default function News() {
	const { t, i18n } = useTranslation()
	const currentLangInfos = getCurrentLangInfos(i18n)
	const [, setLastViewedRelease] = usePersistingState(localStorageKey, null)
	const navigate = useNavigate()
	const slug = useMatch(`${encodeURIComponent('nouveautés')}/:slug`)?.params
		?.slug

	const data = sortReleases(currentLangInfos.releases),
		lastRelease = data && data[0]

	useEffect(() => {
		setLastViewedRelease(lastRelease.name)
	}, [])

	if (!data) {
		return null
	}

	const selectedRelease = data.findIndex(({ name }) => slugify(name) === slug)

	console.log('selectedRelease: ', selectedRelease)

	const getPath = (index: number) => {
		return `${'/nouveautés'}/${slugify(data[index]?.name)}`
	}

	if (!slug || selectedRelease === -1) {
		return <Navigate to={getPath(0)} replace />
	}

	const releaseName = data[selectedRelease].name.toLowerCase()
	const body = data[selectedRelease].body

	// FIXME: doesn't work anymore with the translation...
	// image = body.match(/!\[.*?\]\((.*?)\)/)[1] || undefined

	return (
		<div
			css={`
				@media (min-width: 800px) {
					max-width: 80%;
				}
				margin: 0 auto;
			`}
		>
			<Meta
				description={t('Découvrez les nouveautés de Nos Gestes Climat')}
				title={t(`Nouveautés - version `) + releaseName}
				// image={image}
			/>
			<ScrollToTop key={selectedRelease} />
			<h1>
				<Trans>Les nouveautés ✨</Trans>
			</h1>
			<p>
				<Trans i18nKey={`pages.News.premierParagraphe`}>
					Nous améliorons le site en continu à partir de vos retours. Découvrez
					ici les
				</Trans>{' '}
				{(selectedRelease === 0 ? t('dernières nouveautés') : t(`nouveautés`)) +
					' ' +
					`${
						i18n.language === 'fr'
							? determinant(releaseName)
							: t('pages.News.determinant') + ' '
					}`}
				<strong>{releaseName}</strong>.
			</p>
			<label title={t('titre de la version')}>
				<SmallScreenSelect
					value={selectedRelease}
					onChange={(evt) => {
						console.log('evt:', evt)
						console.log('target:', evt.target)
						navigate(getPath(Number(evt.target.value)))
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
							<NavLink activeClassName="active" to={getPath(index)}>
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
					<MarkdownWithAnchorLinks
						children={body}
						escapeHtml={false}
						renderers={{ text: TextRenderer }}
					/>
					<NavigationButtons>
						{selectedRelease + 1 < data.length ? (
							<Link to={getPath(selectedRelease + 1)}>
								← {data[selectedRelease + 1].name}
							</Link>
						) : (
							<span /> // For spacing
						)}
						{selectedRelease > 0 && (
							<Link to={getPath(selectedRelease - 1)}>
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
		width: 150px;
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
