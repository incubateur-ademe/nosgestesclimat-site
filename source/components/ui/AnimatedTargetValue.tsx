import { formatValue } from 'publicodes'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import './AnimatedTargetValue.css'

type AnimatedTargetValueProps = {
	value?: number
	children?: React.ReactNode
}

const formatDifference = (difference: number, unit: string) => {
	const prefix = difference > 0 ? '+' : ''
	return (
		prefix +
		difference.toLocaleString('fr-FR', { maximumSignificantDigits: 1 }) +
		' ' +
		unit
	)
}

export default function AnimatedTargetValue({
	value,
	children,
	unit,
}: AnimatedTargetValueProps) {
	const previousValue = useRef<number>()

	const difference =
		previousValue.current === value || (value && Number.isNaN(value))
			? null
			: (value || 0) - (previousValue.current || 0)
	const shouldDisplayDifference =
		difference != null &&
		previousValue.current != null &&
		previousValue.current != 0 &&
		value != null

	console.log(shouldDisplayDifference, value, previousValue.current)
	previousValue.current = value

	return (
		<>
			<span className="Rule-value">
				{shouldDisplayDifference && (
					<Evaporate
						style={{
							color: difference > 0 ? 'chartreuse' : 'red',
							pointerEvents: 'none',
						}}
					>
						{formatDifference(difference, unit)}
					</Evaporate>
				)}{' '}
				{children}
			</span>
		</>
	)
}

const Evaporate = React.memo(function Evaporate({
	children,
	style,
}: {
	children: string
	style: React.CSSProperties
}) {
	return (
		<span key={children} style={style} className="evaporate">
			{children}
		</span>
	)
})
