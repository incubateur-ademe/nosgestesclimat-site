import React, { useRef } from 'react'
import styled, { keyframes } from 'styled-components'

type AnimatedTargetValueProps = {
	value?: number
	unit?: string
}

const formatDifference = (difference: number, unit: string) => {
	const prefix = difference > 0 ? '+' : ''
	return prefix + difference + ' ' + unit
}

export default function AnimatedTargetValue({
	value,
	unit,
}: AnimatedTargetValueProps) {
	const previousValue = useRef<number>()
	const previousDifference = useRef<number>()

	let difference =
		value == null || previousValue.current == null
			? undefined
			: value - previousValue.current

	if (previousValue.current !== value) {
		previousValue.current = value
		previousDifference.current = difference
	} else {
		difference = previousDifference.current
	}

	if (!difference || Math.abs(difference) < 1) {
		return null
	}

	if (value == 0) {
		previousValue.current = value
		return null
	}

	return (
		<div
			key={difference + (value ?? 0)}
			css={`
				position: relative;
				text-align: right;
			`}
		>
			<StyledEvaporate>
				{formatDifference(difference ?? 0, unit ?? '')}
			</StyledEvaporate>
		</div>
	)
}

const evaporateAnimation = keyframes`
	5% {
		opacity: 1;
		transform: translateX(-10px) scaleY(1);
	}
	95% {
		opacity: 1;
		transform: translateX(-20px) scaleY(1);
	}
	to {
		transform: translateX(-35px) scaleY(0.1);
		opacity: 0;
	}
`

const StyledEvaporate = styled.div`
	display: block;
	position: absolute;
	z-index: 3;
	right: 7rem;
	color: #ffbb00;
	top: 2.1rem;
	opacity: 0;
	animation: ${evaporateAnimation} 2.5s linear;
	transform: scaleY(0.1);
`
