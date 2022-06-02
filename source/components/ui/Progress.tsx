import React from 'react'
import './Progress.css'

type ProgressProps = {
	progress: number
	style?: React.CSSProperties
	className: string
	label: string
}

export default function Progress({
	progress,
	style,
	className,
	label,
}: ProgressProps) {
	return (
		<div className={'progress__container ' + className} css={style}>
			<div
				className="progress__bar"
				style={{ width: `${progress * 100}%` }}
				aria-label={label}
				role="progressbar"
				aria-valuenow={Math.round(progress * 100)}
			/>
			<span className="visually-hidden">{progress * 100}%</span>
		</div>
	)
}
