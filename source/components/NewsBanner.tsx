import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import lastRelease from '../data/last-release.json'
import { usePersistingState } from './utils/persistState'

export const localStorageKey = 'last-viewed-release'

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
		<div css="margin: 1rem">
			<span>
				{emoji('✨')} Découvrez les nouveautés de la version{' '}
				<Link to={'/nouveautés'}>{lastRelease.name.toLowerCase()}</Link>
			</span>
			<button
				onClick={() => setLastViewedRelease(lastRelease.name)}
				className="ui__ button small plain"
				css="margin-left: 1rem"
				title="Fermer la notification de nouveautés"
			>
				&times;
			</button>
		</div>
	) : null
}
