import { localStorageKey } from 'Components/NewsBanner'
import { usePersistingState } from 'Components/utils/persistState'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getCurrentLangInfos } from 'Source/locales/translation'
import { dateCool, extractImage, getPath, sortReleases } from './NewsItem'

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
					padding-left: 0;
					li {
						width: 18rem !important;
						height: 15rem !important;
						margin: 1rem;
						> a {
							height: 100%;
							width: 100%;
						}
					}
				`}
			>
				{data.map(({ name, published_at: date, body }, index) => (
					<li key={name}>
						<Link
							to={getPath(index, data)}
							className="ui__ card box content"
							css={`
								display: flex;
								flex-direction: column;
							`}
						>
							<img
								src={extractImage(body)}
								css={`
									object-fit: cover;
									width: 12rem;
									height: 8rem;
									margin-bottom: 0.6rem;
								`}
							/>
							<div
								css={`
									line-height: 1.4rem;
									max-width: 80%;
								`}
							>
								{name}
								<div>
									<small>
										{dateCool(new Date(date), currentLangInfos.abrvLocale)}
									</small>
								</div>
							</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
