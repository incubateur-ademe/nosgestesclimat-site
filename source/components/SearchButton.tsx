import { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { Navigate, Redirect } from 'react-router'
import useKeypress from './utils/useKeyPress'

type SearchButtonProps = {
	invisibleButton?: boolean
}

export default function SearchButton({ invisibleButton }: SearchButtonProps) {
	const [visible, setVisible] = useState(false)

	useKeypress(
		'k',
		true,
		(e) => {
			e.preventDefault()
			setVisible(true)
		},
		'keydown',
		[]
	)

	const close = () => setVisible(false)

	return visible ? (
		<Navigate to="/documentation" replace />
	) : (
		<button
			className="ui__ simple small button"
			css={invisibleButton ? 'display: none !important' : ''}
			onClick={() => setVisible(true)}
		>
			{emoji('🔍')} <Trans>Rechercher</Trans>
		</button>
	)
}
