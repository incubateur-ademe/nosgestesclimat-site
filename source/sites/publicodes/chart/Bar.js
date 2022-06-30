import React, { useEffect, useRef, useState } from 'react'
import emoji from 'react-easy-emoji'
import { useHistory, useLocation } from 'react-router'
import { useQuery } from '../../../utils'
import Value from './Value'

export default ({
	nodeValue,
	icons = '🌍',
	color,
	completed,
	title,
	abbreviation,
	empreinteMaximum,
	noText,
	valueColor,
	demoMode,
}) => {
	return (
		<>
			<div
				css={`
					display: flex;
					align-items: center;
					height: 2rem;
					position: relative;
				`}
				title={title}
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
				<span class="visually-hidden">{title}</span>
				<BarContent
					noText={noText}
					color={color}
					text={title}
					shortText={abbreviation}
					widthPercentage={(nodeValue / empreinteMaximum) * 100 * 0.85}
				/>
				<Value {...{ nodeValue, demoMode, completed, color: valueColor }} />
			</div>
		</>
	)
}
export const capitalizeFirst = (text) =>
	text[0].toUpperCase() + text.slice(1, text.length)

const Check = ({}) => <span css="margin-left: .3rem">{emoji(' ✅')}</span>

const BarContent = ({ noText, text, shortText, widthPercentage, color }) => {
	const textRef = useRef(null)
	const barRef = useRef(null)
	const [show, setShow] = useState(true)
	const [usedText, setUsedText] = useState(text)
	useEffect(() => {
		if (!textRef.current || !barRef.current) return undefined
		if (textRef.current.clientWidth + 10 >= barRef.current.clientWidth) {
			usedText === shortText ? setShow(false) : setUsedText(shortText)
		}
	}, [barRef, textRef, usedText])

	return (
		<span
			ref={barRef}
			css={`
				display: inline-block;
				background: ${color};
				margin-top: 0rem;
				margin-right: 0.8rem;
				height: 2rem;
				padding-left: 0.1rem;
				border-radius: 1rem;
				width: ${widthPercentage}%;
				color: white;
				transition: width 0.3s ease-in;
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
						font-size: 110%;
						line-height: 2rem;
						${!show && `display: none`}
					`}
				>
					<span aria-hidden="true">{usedText}</span>
				</span>
			)}
		</span>
	)
}
