import React, { createRef, useLayoutEffect, useRef, useState } from 'react'
import { shadowStyle } from '../styles'
import Value from './Value'
import emoji from 'react-easy-emoji'

export default ({
	nodeValue,
	icons = '🌍',
	color,
	completed,
	title,
	empreinteMaximum,
	noText,
	valueColor,
}) => (
	<>
		<div
			css={`
				display: flex;
				align-items: center;
				height: 1.3rem;
				position: relative;
			`}
		>
			<span
				css={`
					font-size: 140%;
					width: 2.3rem;
					margin-left: -2.3rem;
				`}
			>
				{emoji(icons)}
			</span>
			<BarContent
				noText={noText}
				color={color}
				text={title}
				widthPercentage={(nodeValue / empreinteMaximum) * 100 * 0.85}
			/>

			<Value {...{ nodeValue, completed, color: valueColor }} />
		</div>
	</>
)
export const capitalizeFirst = (text) =>
	text[0].toUpperCase() + text.slice(1, text.length)

const Check = ({}) => <span css="margin-left: .3rem">{emoji(' ✅')}</span>

const BarContent = ({ noText, text, widthPercentage, color }) => {
	const textRef = useRef(null)
	const barRef = useRef(null)
	const [show, setShow] = useState(true)
	useLayoutEffect(() => {
		if (!textRef.current || !barRef.current) return null
		if (textRef.current.clientWidth >= barRef.current.clientWidth) {
			setShow(false)
		}
	}, [barRef, textRef])

	return (
		<span
			ref={barRef}
			css={`
				display: inline-block;
				background: ${color};
				margin-top: 0rem;
				margin-right: 0.8rem;
				height: 1.3rem;
				padding-left: 0.1rem;
				border-radius: 1rem;
				width: ${widthPercentage}%;
				color: white;
			`}
		>
			{!noText && (
				<span
					ref={textRef}
					css={`
						position: absolute;
						margin-left: 0.6rem;
						opacity: 0.9;
						font-weight: bold;
						color: white;
						font-size: 80%;
						line-height: 1.3rem;
						${!show && `display: none`}
					`}
				>
					<span>{text}</span>
				</span>
			)}
		</span>
	)
}
