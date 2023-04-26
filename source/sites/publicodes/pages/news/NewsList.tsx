import { localStorageKey } from 'Components/NewsBanner'
import { usePersistingState } from 'Components/utils/persistState'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getCurrentLangInfos } from 'Source/locales/translation'
import { sortReleases } from './NewsItem'

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
		<ul>
			{data.map((item) => (
				<li className="ui__ card box content">{item.name}</li>
			))}
		</ul>
	)
}
