import emoji from 'react-easy-emoji'
import { Trans, useTranslation } from 'react-i18next'
import { LinkWithQuery } from 'Components/LinkWithQuery'
import lastRelease from '../data/last-release.json'
import { usePersistingState } from './utils/persistState'

export const localStorageKey = 'last-viewed-release'

// TODO: support translations
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

	const { t } = useTranslation()

	return showBanner ? (
		<div css="margin: 1rem">
			<span>
				{emoji('✨')} <Trans>Découvrez les nouveautés de la version</Trans>{' '}
				<LinkWithQuery to={'/nouveautés'}>
					{lastRelease.name.toLowerCase()}
				</LinkWithQuery>
			</span>
			<button
				onClick={() => setLastViewedRelease(lastRelease.name)}
				className="ui__ button small plain"
				css="margin-left: 1rem"
				title={t('Fermer la notification de nouveautés')}
			>
				&times;
			</button>
		</div>
	) : null
}
