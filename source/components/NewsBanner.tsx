import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'Components/Link'
import lastRelease from '../data/last-release.json'
import { usePersistingState } from './utils/persistState'
import styled from 'styled-components'
import { capitalise0 } from '../utils'

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

	const date = new Date(lastRelease.date).toLocaleDateString('fr-FR', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})

	return showBanner ? (
		<div
			css={`
				margin: 2rem auto !important;
				position: relative;
				text-align: left !important;
				h2 {
					display: flex;
					align-items: center;
					margin: 0rem;
				}
			`}
			className="ui__ card box"
		>
			<div>
				<h2>
					<Dot /> <Trans>Nouveautés</Trans>
				</h2>
				<div>
					<small>
						<Trans>Mise à jour le {{ date }}</Trans>
					</small>
				</div>
				<div>
					<Trans>Version</Trans>{' '}
					<Link to={'/nouveautés'}>{capitalise0(lastRelease.name)}</Link>
				</div>
			</div>
			<button
				onClick={() => setLastViewedRelease(lastRelease.name)}
				css="border: none; font-size: 120%; color: var(--color); position: absolute; right: .6rem; top: .6rem; padding: 0"
				title={t('Fermer la notification de nouveautés')}
			>
				&times;
			</button>
		</div>
	) : null
}

const Dot = styled.span`
	background: var(--color);
	width: 0.8rem;
	height: 0.8rem;
	display: inline-block;
	border-radius: 1rem;
	margin-right: 0.4rem;
`
