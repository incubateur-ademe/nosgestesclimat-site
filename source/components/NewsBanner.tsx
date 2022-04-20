import { useLocalStorage, writeStorage } from '@rehooks/local-storage'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import lastRelease from '../data/last-release.json'
import { usePersistingState } from './utils/persistState'

const localStorageKey = 'last-viewed-release'

export const determinant = (word: string) =>
	/^[aeiouy]/i.exec(word) ? 'd’' : 'de '

export default function NewsBanner() {
	const [lastViewedRelease, setLastViewedRelease] = usePersistingState(
		localStorageKey,
		null
	)

	// We only want to show the banner to returning visitors, so we initiate the
	// local storage value with the last release.
	if (lastViewedRelease === undefined) {
		setLastViewedRelease(lastRelease.name)
		return null
	}

	const showBanner = lastViewedRelease !== lastRelease.name

	return showBanner ? (
		<div className="ui__ banner news">
			<span>
				{emoji('✨')} Découvrez les nouveautés de la version{' '}
				<Link to={'/nouveautés'}>{lastRelease.name.toLowerCase()}</Link>
			</span>
			<span
				onClick={() => setLastViewedRelease(lastRelease.name)}
				className="ui__ close-button"
			>
				{' '}
				&times;
			</span>
		</div>
	) : null
}
