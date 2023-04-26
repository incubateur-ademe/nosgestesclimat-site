import { localStorageKey } from 'Components/NewsBanner'
import { usePersistingState } from 'Components/utils/persistState'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getCurrentLangInfos } from 'Source/locales/translation'
import { dateCool, getPath, sortReleases } from './NewsItem'

export default () => {
	const { t, i18n } = useTranslation()
	const currentLangInfos = getCurrentLangInfos(i18n)
	const [, setLastViewedRelease] = usePersistingState(localStorageKey, null)

	const data = sortReleases(currentLangInfos.releases),
		lastRelease = data && data[0]

	console.log(data)

	useEffect(() => {
		setLastViewedRelease(lastRelease.name)
	}, [])

	if (!data) {
		return null
	}

	return (
		<div>
			<ul
				css={`
					display: flex;
					flex-wrap: wrap;
					list-style-type: none;
					justify-content: center;
					li {
						width: 20rem !important;
						height: 8rem !important;
						margin: 1rem;
						> div {
							height: 100%;
						}
					}
				`}
			>
				{data.map(({ name, published_at: date }, index) => (
					<li key={name}>
						<div className="ui__ card box content">
							<Link to={getPath(index, data)}>
								{name}
								<div>
									<small>
										{dateCool(new Date(date), currentLangInfos.abrvLocale)}
									</small>
								</div>
							</Link>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}
